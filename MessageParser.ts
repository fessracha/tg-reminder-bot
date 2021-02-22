export default class MessageParser {
  static parse(userMsg: string): { cronTabDate: string, text: string } {
    const [date, message] = userMsg.split('/');
    // @ts-ignore
    const [day, month, hour, min] = date.match(/\d+/g);
    return {
      cronTabDate: `${min} ${hour} ${day} ${month} *`,
      text: message
    }
  }
}