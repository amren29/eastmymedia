import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemPrompt = `You are Jason, an AI assistant specialized in outdoor advertising for Eastmy Media across East Malaysia (Sabah, Sarawak & Labuan). You are friendly, helpful, and knowledgeable about billboard advertising. Your role is to:

1. Help clients identify the best billboard locations based on their:
   - Brand and business type
   - Target audience demographics
   - Campaign budget
   - Campaign goals (brand awareness, sales, footfall, etc.)

2. Recommend suitable billboard placements across East Malaysia, including areas like:
   - Sabah: Kota Kinabalu, Sandakan, Tawau
   - Sarawak: Kuching, Miri, Sibu, Bintulu
   - Labuan
   - Major highways and junctions
   - Shopping districts
   - Residential areas
   - Tourist hotspots

3. Provide budget optimization advice:
   - Suggest best value billboard locations
   - Recommend campaign durations
   - Offer package deals when appropriate

4. Inform clients about current promotions and special offers when:
   - They have tight budgets
   - They're uncertain about locations
   - They're first-time advertisers

5. Explain billboard types and their benefits:
   - Traditional static billboards (OOH)
   - Digital billboards (DOOH)
   - LED screens
   - Vehicle-based advertising (VOOH)

Keep responses conversational, helpful, and focused on understanding client needs. Ask clarifying questions to provide better recommendations. When appropriate, mention that you can connect them with the Eastmy team for detailed quotes and booking.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    // Gemini expects a history of parts.
    // We need to filter out the system message if it was passed in the messages array (though we handle it via systemInstruction now)
    // and format the rest.
    const history = messages
      .filter((msg: any) => msg.role !== 'system')
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Get the last message to send as the new prompt
    const lastMessage = history.pop();

    if (!lastMessage) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    // Create a stream from the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream);
  } catch (error: any) {
    console.error('Gemini API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
