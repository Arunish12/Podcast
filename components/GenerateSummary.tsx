import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "./ui/textarea"; 
import { Label } from './ui/label'

const GenerateSummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(""); // User enters custom prompt
  const [summary, setSummary] = useState(""); // Stores the generated summary
  const { toast } = useToast();
  const getSummary = useAction(api.openai.generateSummaryAction);

  const generateSummary = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please provide a valid prompt", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await getSummary({ text: prompt });
      setSummary(response); // Store generated summary
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({ title: "Error generating summary", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Heading */}
      <Label className="text-16 font-bold text-white-1 ">
          AI Prompt to generate Summary For The Podcast
      </Label>

      {/* Prompt Input */}
      <Textarea
        className="input-class font-light focus-visible:ring-offset-orange-1"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Enter a topic or description..."
      />

      {/* Button Positioned to the Left */}
      <div className="mt-4">
        <Button 
          type="button" 
          className="text-16 bg-orange-1 py-4 font-bold text-white-1" 
          onClick={generateSummary}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
      </div>

      {/* Editable Summary Output */}
      <Textarea
        className="input-class font-light focus-visible:ring-offset-orange-1 mt-3"
        value={summary}
        onChange={(e) => setSummary(e.target.value)} // Allow editing
        rows={5}
        placeholder="Generated summary will appear here..."
      />
    </div>
  );
};

export default GenerateSummary;
