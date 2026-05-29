from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = ROOT / "project_context.md"
MAX_FILE_SIZE = 500 * 1024

IGNORED_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    "target",
    "coverage",
    "venv",
    ".venv",
    "env",
    ".env",
    ".next",
    ".nuxt",
    ".turbo",
    ".cache",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
}

IGNORED_FILES = {
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
    ".DS_Store",
    "Thumbs.db",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "npm-shrinkwrap.json",
}

IGNORED_EXTENSIONS = {
    ".png",
    ".jpg"
    ".md",
    ".jpeg",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".7z",
    ".rar",
    ".exe",
    ".dll",
    ".so",
    ".dylib",
    ".pyc",
    ".pyo",
    ".map",
}

TEXT_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".markdown",
    ".txt",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".html",
    ".htm",
    ".xml",
    ".yml",
    ".yaml",
    ".toml",
    ".ini",
    ".cfg",
    ".conf",
    ".sh",
    ".bash",
    ".zsh",
    ".ps1",
    ".psm1",
    ".bat",
    ".cmd",
}


def detect_framework(root: Path) -> str:
    package_json = root / "package.json"
    if package_json.is_file():
        try:
            data = json.loads(package_json.read_text(encoding="utf-8"))
        except Exception:
            data = {}
        dependencies = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
        if any(name.startswith("@vue/") for name in dependencies):
            return "Vue"
        if any(name.startswith("next") for name in dependencies):
            return "Next.js"
        if any(name.startswith("svelte") for name in dependencies):
            return "Svelte"
        if any(name.startswith("react") or name.startswith("@react-") for name in dependencies):
            return "Node / React"
        return "Node.js"

    if (root / "pyproject.toml").is_file() or (root / "requirements.txt").is_file() or (root / "setup.py").is_file():
        return "Python"
    if (root / "pom.xml").is_file() or any(root.glob("**/*.java")):
        return "Java Spring / Java"
    if (root / "Cargo.toml").is_file():
        return "Rust"
    return "Unknown"


def prompt_framework(default_framework: str) -> str:
    try:
        answer = input(
            f"Detected framework: {default_framework}. Press Enter to accept or type a different framework: "
        ).strip()
    except EOFError:
        return default_framework
    return answer or default_framework


def is_hidden(path: Path) -> bool:
    return any(part.startswith(".") and part not in {".", ".."} for part in path.parts)


def should_ignore_dir(name: str) -> bool:
    return name in IGNORED_DIRS


def should_ignore_file(path: Path) -> bool:
    name = path.name
    suffix = path.suffix.lower()
    lower_name = name.lower()
    if name in IGNORED_FILES or lower_name in IGNORED_FILES:
        return True
    if suffix in IGNORED_EXTENSIONS:
        return True
    if lower_name.endswith((".min.js", ".min.css")):
        return True
    return False


def is_likely_text_file(path: Path) -> bool:
    lower_name = path.name.lower()
    suffix = path.suffix.lower()
    if lower_name in TEXT_EXTENSIONS:
        return True
    if suffix in TEXT_EXTENSIONS:
        return True
    if lower_name.startswith(("readme", "license", "changelog", "makefile", "dockerfile")):
        return True
    if path.name.startswith(".") and path.name not in IGNORED_FILES:
        return True
    return False


def is_binary_file(path: Path) -> bool:
    try:
        with path.open("rb") as handle:
            chunk = handle.read(8192)
    except OSError:
        return True
    if b"\x00" in chunk:
        return True
    try:
        chunk.decode("utf-8")
    except UnicodeDecodeError:
        return True
    return False


def iter_project_files(root: Path, excluded_paths: set[Path] | None = None) -> list[Path]:
    files: list[Path] = []
    excluded_paths = {path.resolve() for path in (excluded_paths or set())}
    for current_root, dirnames, filenames in os.walk(root):
        current_path = Path(current_root)
        dirnames[:] = [name for name in dirnames if not should_ignore_dir(name) and not name.startswith(".")]
        for filename in filenames:
            file_path = current_path / filename
            try:
                resolved_path = file_path.resolve()
            except OSError:
                continue
            if resolved_path in excluded_paths:
                continue
            relative = file_path.relative_to(root)
            if should_ignore_file(file_path):
                continue
            if is_hidden(relative):
                continue
            if not file_path.is_file():
                continue
            try:
                if file_path.stat().st_size > MAX_FILE_SIZE:
                    continue
            except OSError:
                continue
            if not is_likely_text_file(file_path):
                continue
            if is_binary_file(file_path):
                continue
            files.append(file_path)
    files.sort(key=lambda item: item.relative_to(root).as_posix().lower())
    return files


def build_tree(root: Path, files: Iterable[Path]) -> list[str]:
    tree: dict[str, dict] = {}
    for file_path in files:
        relative_parts = file_path.relative_to(root).parts
        cursor = tree
        for part in relative_parts[:-1]:
            cursor = cursor.setdefault(part, {})
        cursor.setdefault(relative_parts[-1], None)

    lines: list[str] = []

    def walk(node: dict[str, dict | None], prefix: str = "") -> None:
        items = sorted(node.items(), key=lambda item: (item[1] is None, item[0].lower()))
        for index, (name, child) in enumerate(items):
            is_last = index == len(items) - 1
            connector = "└── " if is_last else "├── "
            lines.append(f"{prefix}{connector}{name}")
            if child is not None:
                extension = "    " if is_last else "│   "
                walk(child, prefix + extension)

    lines.append(root.name)
    walk(tree)
    return lines


def language_for_file(path: Path) -> str:
    lower_name = path.name.lower()
    suffix = path.suffix.lower()
    mapping = {
        ".py": "python",
        ".js": "javascript",
        ".jsx": "javascript",
        ".mjs": "javascript",
        ".cjs": "javascript",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".json": "json",
        ".md": "markdown",
        ".markdown": "markdown",
        ".txt": "text",
        ".css": "css",
        ".scss": "scss",
        ".sass": "sass",
        ".less": "less",
        ".html": "html",
        ".htm": "html",
        ".xml": "xml",
        ".yml": "yaml",
        ".yaml": "yaml",
        ".toml": "toml",
        ".ini": "ini",
        ".cfg": "ini",
        ".conf": "ini",
        ".sh": "bash",
        ".bash": "bash",
        ".zsh": "bash",
        ".ps1": "powershell",
        ".psm1": "powershell",
        ".bat": "bat",
        ".cmd": "bat",
    }
    if lower_name == "dockerfile" or suffix == ".dockerfile":
        return "dockerfile"
    if lower_name.startswith("readme") or suffix == ".md":
        return "markdown"
    if lower_name.startswith("makefile"):
        return "makefile"
    return mapping.get(suffix, "text")


def read_text_file(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def render_markdown(root: Path, framework: str, files: list[Path]) -> str:
    tree_lines = build_tree(root, files)
    lines: list[str] = []
    lines.append(f"# Project Context: {root.name}")
    lines.append("")
    lines.append("## Overview")
    lines.append("")
    lines.append(f"- Framework: {framework}")
    lines.append(f"- Root path: {root.resolve().as_posix()}")
    lines.append(f"- Files included: {len(files)}")
    lines.append(f"- Max file size: {MAX_FILE_SIZE // 1024} KB")
    lines.append("")
    lines.append("## Directory Tree")
    lines.append("")
    lines.append("```text")
    lines.extend(tree_lines)
    lines.append("```")
    lines.append("")
    lines.append("## File Contents")
    lines.append("")

    for file_path in files:
        relative_path = file_path.relative_to(root).as_posix()
        absolute_path = file_path.resolve().as_posix()
        language = language_for_file(file_path)
        content = read_text_file(file_path)
        lines.append(f"### {relative_path}")
        lines.append("")
        lines.append(f"Absolute path: {absolute_path}")
        lines.append("")
        lines.append(f"```{language}")
        lines.append(content.rstrip("\n"))
        lines.append("```")
        lines.append("")

    lines.append("## Ignored And Skipped")
    lines.append("")
    lines.append("- Common build, cache, dependency, environment, binary, and image directories are excluded.")
    lines.append("- Files larger than 500 KB are skipped.")
    lines.append("- Binary or non-text files are skipped.")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Package a project into a single LLM-friendly Markdown file."
    )
    parser.add_argument(
        "--framework",
        help="Override the detected framework name.",
    )
    parser.add_argument(
        "--output",
        default=str(OUTPUT_FILE),
        help="Output Markdown file path.",
    )
    parser.add_argument(
        "--no-prompt",
        action="store_true",
        help="Disable interactive framework prompting.",
    )
    args = parser.parse_args()

    framework = args.framework or detect_framework(ROOT)
    if not args.framework and not args.no_prompt and framework == "Unknown":
        framework = prompt_framework(framework)

    output_path = Path(args.output).resolve()
    files = iter_project_files(ROOT, {output_path})
    markdown = render_markdown(ROOT, framework, files)

    output_path.write_text(markdown, encoding="utf-8", newline="\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())