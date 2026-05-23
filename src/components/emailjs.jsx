import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Mail, User, MessageSquare, Sparkles, Check } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const ContactForm = () => {
	const formRef = useRef(null);
	const [isSending, setIsSending] = useState(false);
	const [status, setStatus] = useState({ type: '', message: '' });

	const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
	const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
	const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
	const hasValidConfig = serviceId && templateId && publicKey && serviceId !== templateId;

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!serviceId || !templateId || !publicKey) {
			// Configuration is invalid — show the persistent config warning instead of
			// placing this validation message inside the transient message box.
			console.warn('Email configuration is missing. Please add the Vite EmailJS env variables.');
			return;
		}

		if (serviceId === templateId) {
			// Don't show this in the message box; keep the separate config notice visible.
			console.warn('EmailJS template ID looks incorrect. Service ID and template ID are identical.');
			return;
		}

		if (!formRef.current) {
			console.error('Form is not ready yet.');
			return;
		}

		setIsSending(true);
		setStatus({ type: '', message: '' });

		try {
			await emailjs.sendForm(serviceId, templateId, formRef.current, {
				publicKey,
			});

			formRef.current.reset();
			setStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon.' });
			setAnimateSuccess(true);
			setTimeout(() => setAnimateSuccess(false), 2400);
		} catch (error) {
			setStatus({
				type: 'error',
				message: 'Something went wrong while sending your message. Please try again.',
			});
			console.error('EmailJS sendForm error:', error);
		} finally {
			setIsSending(false);
		}
	};

	const [animateSuccess, setAnimateSuccess] = useState(false);

	return (
		<AnimatedSection id="contact" className="pb-4">
			<div className="mb-12 text-left">
				<p className="text-orange-500 font-semibold tracking-wide uppercase mb-4 flex items-center justify-start gap-2">
					<Sparkles size={16} /> Let's connect
				</p>
				<h3 className="text-3xl font-bold mb-4 text-white">Send a message</h3>
				<p className="max-w-2xl text-slate-400 text-lg leading-relaxed">
					Have a project, role, or collaboration in mind? Send a quick note and I'll respond as soon as possible.
				</p>
			</div>

			<div className="w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-800/70 shadow-xl shadow-black/20 backdrop-blur-sm overflow-hidden">
				<div className="h-px bg-gradient-to-r from-orange-500/70 via-amber-400/50 to-orange-500/70" />

				<form ref={formRef} onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10 space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<label className="block">
							<span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
								<User size={16} className="text-orange-500" />
								Name
							</span>
							<input
							type="text"
							name="from_name"
								required
								placeholder=" Your dear beautiful name"
								className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
							/>
						</label>

						<label className="block">
							<span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
								<Mail size={16} className="text-orange-500" />
								Email
							</span>
							<input
								type="email"
								name="reply_to"
								required
								placeholder="your_email@domain.com"
								className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
							/>
						</label>
					</div>

					<label className="block">
						<span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
							<MessageSquare size={16} className="text-orange-500" />
							Message
						</span>
						<textarea
							name="message"
							required
							rows="6"
							placeholder="Tell me about your project or opportunity..."
							className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
						/>
					</label>

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-slate-500">
							looking forward to hearing from you! Whether it's a question, opportunity, or just a hello, don't hesitate to reach out. I'll do my best to respond promptly.
						</p>

						<button
							type="submit"
							disabled={isSending}
							className={`send-button inline-flex items-center justify-center gap-3 rounded-xl px-5 py-3 font-medium text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
								animateSuccess ? 'success' : ''
							}`}
							style={{ background: 'linear-gradient(90deg, #355E3B 0%, #D6C9A6 100%)' }}
						>
							{isSending ? (
								<span className="label whitespace-nowrap">Sending...</span>
							) : animateSuccess ? (
								<>
									<Check size={18} className="animate-pop" />
									<span className="label whitespace-nowrap">Sent</span>
								</>
							) : (
								<>
									<Send size={18} />
									<span className="label whitespace-nowrap">Send Message</span>
								</>
							)}
						</button>
					</div>

					{status.message && (
						<div
							className={`rounded-xl border px-4 py-3 text-sm ${
								status.type === 'success'
									? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
									: 'border-rose-500/30 bg-rose-500/10 text-rose-300'
							}`}
						>
							{status.message}
						</div>
					)}

					{!hasValidConfig && (
						<div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
							Double-check your EmailJS .env values before sending. The template ID must be a real EmailJS template ID, not the service ID.
						</div>
					)}
				</form>
			</div>
		</AnimatedSection>
	);
};
