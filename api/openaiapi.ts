export default class OpenaiAPI {
  static summarize = async (text: string) => {
    const response = await fetch(`${process.env.BASE_API_URL}/api/openai`, {
      method: 'POST',
      body: JSON.stringify({
        text,
      }),
    });
    return response.json();
  };
}
