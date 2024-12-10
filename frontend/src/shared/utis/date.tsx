export function parseDate(dateString:string):Date {
    // Разделяем строку на день, месяц и год
    const [day, month, year] = dateString.split('.').map(Number);

    // Создаем объект Date (месяцы начинаются с 0, поэтому вычитаем 1 из месяца)
    const date = new Date(year, month - 1, day);

    return date;
}

export function formatToISO(dateString: string): string {
    // Разделяем строку на части (месяц, день, год)
    const [month, day, year] = dateString.split('.');

    // Возвращаем строку в формате YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}