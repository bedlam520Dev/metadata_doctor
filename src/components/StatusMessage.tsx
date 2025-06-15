import React, { useEffect } from 'react';

interface StatusMessageProps {
	message: string;
	type: 'info' | 'success' | 'error';
	onClose?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
	message,
	type,
	onClose,
}) => {
	useEffect(() => {
		if (type === 'success' && onClose) {
			const timer = setTimeout(onClose, 3000);
			return () => clearTimeout(timer);
		}
	}, [type, onClose]);

	if (!message) return null;

	const bgColor =
		type === 'error' ? 'bg-red-50 border-red-200 text-red-800'
		: type === 'success' ? 'bg-green-50 border-green-200 text-green-800'
		: 'bg-blue-50 border-blue-200 text-blue-800';

	return (
		<div className={`p-4 rounded-lg border ${bgColor} text-center mb-4`}>
			{message}
		</div>
	);
};

export default StatusMessage;
