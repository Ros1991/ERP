export class DateUtils {
  /**
   * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
   */
  static formatToBrazilian(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Formata uma data e hora para o padrão brasileiro (DD/MM/YYYY HH:mm:ss)
   */
  static formatDateTimeToBrazilian(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR');
  }

  /**
   * Converte uma string no formato DD/MM/YYYY para Date
   */
  static parseFromBrazilian(dateString: string): Date {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      throw new Error('Formato de data inválido. Use DD/MM/YYYY');
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Data contém valores não numéricos');
    }
    
    return new Date(year, month - 1, day);
  }

  /**
   * Verifica se uma data é válida
   */
  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Adiciona dias a uma data
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Adiciona meses a uma data
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Adiciona anos a uma data
   */
  static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Calcula a diferença em dias entre duas datas
   */
  static diffInDays(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Calcula a diferença em horas entre duas datas
   */
  static diffInHours(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600));
  }

  /**
   * Retorna o início do dia (00:00:00)
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Retorna o fim do dia (23:59:59.999)
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Retorna o primeiro dia do mês
   */
  static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Retorna o último dia do mês
   */
  static endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Verifica se uma data está entre duas outras datas
   */
  static isBetween(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * Retorna a data atual sem horário (apenas data)
   */
  static today(): Date {
    return this.startOfDay(new Date());
  }

  /**
   * Verifica se uma data é hoje
   */
  static isToday(date: Date): boolean {
    const today = this.today();
    const checkDate = this.startOfDay(date);
    return today.getTime() === checkDate.getTime();
  }

  /**
   * Verifica se uma data é no passado
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Verifica se uma data é no futuro
   */
  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Formata uma duração em horas para formato legível
   */
  static formatDuration(hours: number): string {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min`;
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    
    return `${wholeHours}h ${minutes}min`;
  }

  /**
   * Converte uma string ISO para Date
   */
  static fromISO(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * Converte uma Date para string ISO
   */
  static toISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Retorna o nome do mês em português
   */
  static getMonthName(monthIndex: number): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex] || '';
  }

  /**
   * Retorna o nome do dia da semana em português
   */
  static getDayName(dayIndex: number): string {
    const days = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return days[dayIndex] || '';
  }
}

