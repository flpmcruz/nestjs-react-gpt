import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxSelect, GptMessageAudio } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text'
}

interface AudioMessage {
  text: string;
  audio: string;
  isGpt: boolean;
  type: 'audio'
}

type Message = TextMessage | AudioMessage

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])


  const handlePost = async (text: string, voice: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

    const { message, ok, audioUrl } = await textToAudioUseCase(text, voice);
    setIsLoading(false);

    if (!ok) return
    setMessages((prev) => [...prev, { text: `${voice}-${message}`, isGpt: true, type: 'audio', audio: audioUrl! }]);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, qué audio quieres generar hoy. * Todo el audio generado es por IA" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  message.type === 'audio' ?
                    <GptMessageAudio key={index}
                      text={message.text}
                      audio={message.audio}
                    />
                    : <GptMessage key={index} text={message.text} />
                )
                : (
                  <MyMessage key={index} text={message.text} />
                )

            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }


        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder='Escribe aquí lo que deseas'
        options={voices}
      />
    </div>
  );
};