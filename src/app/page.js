"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function GenerateImageChat() {
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recallCount, setRecallCount] = useState(0);
  const [error, setError] = useState(null);

  // Load saved chats from local storage on mount
  useEffect(() => {
    try {
      const savedChats = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
      );
      setChats(savedChats);
    } catch (error) {
      console.error("Error parsing chat history from local storage:", error);
      setChats([]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    const pastPrompts =
      recallCount > 0
        ? chats.slice(-recallCount).map((chat) => chat.prompt)
        : [];
    const context = pastPrompts.join(" and ");

    try {
      const response = await fetch("/api/v1/gen-img-flux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage =
          data.error || "An error occurred while generating the image.";
        if (response.status === 403) {
          errorMessage = "Whoops, this machine has run out of cash.";
        }
        throw new Error(errorMessage);
      }

      const newImage = data.result?.images[0]?.url;

      if (newImage) {
        const newChat = { prompt, result: newImage };
        setChats((prevChats) => {
          const updatedChats = [...prevChats, newChat];
          saveChatsToLocalStorage(updatedChats);
          return updatedChats;
        });
      } else {
        throw new Error("Image generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const saveChatsToLocalStorage = (updatedChats) => {
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
  };

  const deleteChat = (indexToDelete) => {
    const updatedChats = chats.filter((_, index) => index !== indexToDelete);
    setChats(updatedChats);
    saveChatsToLocalStorage(updatedChats);
  };

  const reFirePrompt = async (existingPrompt, index) => {
    setLoading(true);
    setError(null);

    // Calculate the maximum possible Recall count based on the prompt's index
    const maxRecall = Math.min(recallCount, index);

    // Gather the past prompts based on the new adjusted Recall count
    const pastPrompts =
      maxRecall > 0
        ? chats.slice(index - maxRecall, index).map((chat) => chat.prompt)
        : [];
    const context = pastPrompts.join(" and ");

    try {
      const response = await fetch("/api/v1/gen-img-flux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: existingPrompt, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage =
          data.error || "An error occurred while generating the image.";
        if (response.status === 403) {
          errorMessage = "Whoops, this machine has run out of cash.";
        }
        throw new Error(errorMessage);
      }

      const newImage = data.result?.images[0]?.url;

      if (newImage) {
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          updatedChats[index].result = newImage;
          saveChatsToLocalStorage(updatedChats);
          return updatedChats;
        });
      } else {
        throw new Error("Image generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-screen flex justify-center">
      <div className="min-h-screen max-w-[1440px] lg:gap-32 flex flex-col xl:flex-row items-center justify-around py-8 px-4">
        <div className="max-w-3xl flex items-start text-start flex-col xl:max-w-screen xl:w-80">
          <h1 className="text-4xl font-light text-gray-100 mb-6">NextFlux</h1>
          <p className="text-opacity-50 font-normal text-gray-100 mb-2">
            A simple, plug-and-play Next.js image generator using Flux.1 Dev via
            fal.ai API. NextFlux enables multi-turn image generation by
            including previous prompts as context through{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-gray-100">Recall</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-60 bg-black text-xgrey border-xgrey border-[1px] border-opacity-25 ease-in-out transition">
                  <p>
                    Recall lets you combine past prompts with your current
                    prompt to enhance the AI&apos;s contextual understanding.
                    Selecting 0 prompts starts a fresh generation without prior
                    context.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <p className="mt-2 text-opacity-50 font-normal text-gray-100 mb-6">
                    When Re-firing a prompt, Recall will apply up to the number
                    of available previous prompts. If the Recall count is larger
                    than the number of earlier prompts, it will only use as many
                    as possible.
                  </p>
          <div className="text-gray-100 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="mb-2">Recall previous prompts:</p>
                </TooltipTrigger>
                <TooltipContent className="max-w-60 bg-black text-xgrey border-xgrey border-[1px] border-opacity-25 ease-in-out transition">
                  <p>
                    Recall lets you combine past prompts for multi-turn
                    generation, giving the AI short-term memory. Selecting 0
                    prompts starts a fresh generation with no memory.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              onValueChange={(value) => setRecallCount(Number(value))}
              value={recallCount.toString()}
            >
              <SelectTrigger className="w-[180px] bg-black text-xgrey border-xgrey border-[1px] border-opacity-25  ease-in-out transition">
                <SelectValue
                  value={recallCount.toString()}
                  placeholder="Select Recall Count"
                />
              </SelectTrigger>
              <SelectContent className="bg-black text-xgrey border-xgrey border-[1px] border-opacity-25 ease-in-out transition">
                <SelectItem value="0">0 (New Prompt)</SelectItem>
                <SelectItem value="1">1 Prompt</SelectItem>
                <SelectItem value="2">2 Prompts</SelectItem>
                <SelectItem value="3">3 Prompts</SelectItem>
                <SelectItem value="4">4 Prompts</SelectItem>
                <SelectItem value="5">5 Prompts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl lg:min-w-[900px] rounded-lg p-4 overflow-auto mb-6 h-[75vh] border-[0.5px] border-opacity-25 border-xgrey">
            {chats.length === 0 ? (
              <div className="text-gray-200 text-center ">
                No images generated yet.
              </div>
            ) : (
              chats.map((chat, index) => (
                <div key={index} className="mb-4">
                  <div className="bg-gray-800 bg-opacity-45 text-gray-100 p-3 rounded-md mb-2 flex flex-col justify-between">
                    {chat.prompt}
                    <Separator className="my-4 opacity-5" />
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => reFirePrompt(chat.prompt, index)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        Re-fire
                      </button>

                      <button
                        onClick={() => deleteChat(index)}
                        className="text-red-400 hover:text-red-600 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {chat.result && (
                    <div className="border border-xgrey border-opacity-15 rounded-lg p-2 flex flex-col">
                      <Image
                        src={chat.result}
                        alt={`Generated Image ${index}`}
                        width={900}
                        height={500}
                        className="rounded-md"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Generated Image: {index + 1}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-row align-middle gap-4 items-center"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter image prompt"
              className="w-full p-3 rounded-md border border-xgrey border-opacity-20 bg-black text-gray-200 focus:outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              className={`py-3 px-4 bg-gray-50 transition hover:bg-gray-300 ease-in-out rounded-full text-gray-950 font-normal flex items-center justify-center space-x-2 ${
                !prompt.trim() || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!prompt.trim() || loading}
            >
              {loading ? <span>⏳</span> : <span>→</span>}
            </button>
          </form>
          {error && (
            <div className="text-red-700 px-2 py-2 border-opacity-15 relative mb-4">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
