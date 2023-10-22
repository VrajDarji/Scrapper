import { Volume2 } from "lucide-react";
import React, { useState } from "react";
import Loader from "./assets/Loader";
type DataState = {
  name: string;
  price: string;
  img: string;
};

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataState>();
  const TextToSpeech = (data: string) => {
    const synth = window.speechSynthesis;
    const utterence = new SpeechSynthesisUtterance(data);
    synth.speak(utterence);
  };
  const SendData = async (data: string) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    };
    setLoading(true);
    const url = "http://localhost:5000";
    const response = await fetch(url, options);
    try {
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setData(result);
        TextToSpeech(`${result.name} is for ${result.price}`);
      } else {
        console.error("Failed to send data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main className="w-full flex justify-center items-center h-[100vh]">
        <div className="w-[30rem] p-6 shadow-2xl rounded-xl flex flex-col gap-3 bg-[#f9f9f9] relative">
          {loading && (
            <div className="absolute top-0 left-0 w-full rounded-xl h-full bg-[rgba(0,0,0,0.1)] z-20 flex justify-center items-center">
              <Loader />
            </div>
          )}
          <h1 className="uppercase text-2xl font-semibold text-center">
            product search
          </h1>
          <label htmlFor="inp" className="mb-[-.6rem]">
            Write the product name
          </label>
          <input
            type="text"
            id="inp"
            className="w-full p-2 border-2 rounded-md  outline-none text-neutral-500 disabled:opacity-50"
            placeholder="Enter product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <button
            className="w-full p-2 bg-[#6557f5] border-2 btn rounded-md text-xl font-medium text-white disabled:opacity-50 hover:border-2 hover:border-[#6557f5] hover:bg-white hover:text-[#6557f5]"
            onClick={() => SendData(search)}
            disabled={loading}
          >
            Search
          </button>
          {data && (
            <div className="flex flex-row gap-3">
              <img src={data.img} alt={data.name} />
              <div className="flex flex-col gap-1">
                <p>
                  {data.name} is for {data.price}
                </p>
                <button
                  onClick={() => {
                    TextToSpeech(`${data.name} is for ${data.price}`);
                  }}
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
