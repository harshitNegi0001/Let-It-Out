

export const formatTime = (dateStr) => {
        if (!dateStr) return '';

        // remove microseconds + force UTC
        const cleaned = dateStr.split('.')[0] + 'Z';
        const date = new Date(cleaned);

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();
    }

export const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const inputDate = new Date(dateStr); // UTC → local automatically
    const today = new Date();

    // Normalize both to local midnight
    const normalize = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const inputDay = normalize(inputDate);
    const todayDay = normalize(today);

    const diffDays =
        (todayDay - inputDay) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    return inputDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}