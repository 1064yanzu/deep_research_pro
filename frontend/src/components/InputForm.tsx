import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SquarePen,
  Brain,
  Send,
  StopCircle,
  Zap,
  Cpu,
  Search,
  PlusCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const questionMap: Record<string, string> = {
  ai: "近年人工智能的发展趋势",
  sustainability: "可持续发展领域的最新研究",
  economy: "国际经济形势分析",
  custom: "",
};

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (
    inputValue: string,
    effort: string,
    model: string,
    searchEngine: string
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [selectedTopic, setSelectedTopic] = useState("ai");
  const [hasAdditional, setHasAdditional] = useState("no");
  const [customQuery, setCustomQuery] = useState("");
  const [additionalReq, setAdditionalReq] = useState("");
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("gemini-2.5-flash-preview-04-17");
  const [searchEngine, setSearchEngine] = useState("google");

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let topicText = "";
    if (selectedTopic === "custom") {
      if (!customQuery.trim()) return;
      topicText = customQuery.trim();
    } else {
      topicText = questionMap[selectedTopic];
    }
    let finalText = topicText;
    if (hasAdditional === "yes" && additionalReq.trim()) {
      finalText += " " + additionalReq.trim();
    }
    onSubmit(finalText, effort, model, searchEngine);
    setCustomQuery("");
    setAdditionalReq("");
  };

  const handleInternalKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled =
    (selectedTopic === "custom" && !customQuery.trim()) || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className={`flex flex-col gap-2 p-3 `}
    >
      <div className="flex flex-col gap-2 bg-neutral-700 rounded-3xl p-3 text-white">
        <div className="flex flex-row items-center text-sm gap-2">
          <Brain className="h-4 w-4" /> 选择研究主题
        </div>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-full bg-neutral-800 border-neutral-600 cursor-pointer">
            <SelectValue placeholder="请选择研究主题" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
            <SelectItem value="ai" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              近年人工智能的发展趋势
            </SelectItem>
            <SelectItem value="sustainability" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              可持续发展领域的最新研究
            </SelectItem>
            <SelectItem value="economy" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              国际经济形势分析
            </SelectItem>
            <SelectItem value="custom" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              自定义问题
            </SelectItem>
          </SelectContent>
        </Select>
        {selectedTopic === "custom" && (
          <Textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={handleInternalKeyDown}
            placeholder="请输入自定义问题"
            className="w-full text-neutral-100 placeholder-neutral-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none md:text-base min-h-[56px] max-h-[200px]"
            rows={2}
          />
        )}
        <div className="flex flex-row items-center text-sm gap-2 mt-2">
          <PlusCircle className="h-4 w-4" /> 是否有补充要求?
        </div>
        <Select value={hasAdditional} onValueChange={setHasAdditional}>
          <SelectTrigger className="w-full bg-neutral-800 border-neutral-600 cursor-pointer">
            <SelectValue placeholder="选择是否有补充要求" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
            <SelectItem value="no" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              无
            </SelectItem>
            <SelectItem value="yes" className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer">
              有
            </SelectItem>
          </SelectContent>
        </Select>
        {hasAdditional === "yes" && (
          <Textarea
            value={additionalReq}
            onChange={(e) => setAdditionalReq(e.target.value)}
            placeholder="请输入补充要求"
            className="w-full text-neutral-100 placeholder-neutral-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none md:text-base min-h-[56px] max-h-[200px]"
            rows={2}
          />
        )}
        <div className="-mt-3">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 cursor-pointer rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className={`${
                isSubmitDisabled
                  ? "text-neutral-500"
                  : "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
              } p-2 cursor-pointer rounded-full transition-all duration-200 text-base`}
              disabled={isSubmitDisabled}
            >
              Search
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 bg-neutral-700 border-neutral-600 text-neutral-300 focus:ring-neutral-500 rounded-xl rounded-t-sm pl-2  max-w-[100%] sm:max-w-[90%]">
            <div className="flex flex-row items-center text-sm">
              <Brain className="h-4 w-4 mr-2" />
              Effort
            </div>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[120px] bg-transparent border-none cursor-pointer">
                <SelectValue placeholder="Effort" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
                <SelectItem
                  value="low"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 bg-neutral-700 border-neutral-600 text-neutral-300 focus:ring-neutral-500 rounded-xl rounded-t-sm pl-2  max-w-[100%] sm:max-w-[90%]">
            <div className="flex flex-row items-center text-sm ml-2">
              <Cpu className="h-4 w-4 mr-2" />
              Model
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[150px] bg-transparent border-none cursor-pointer">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
                <SelectItem
                  value="gemini-2.0-flash"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-400" /> 2.0 Flash
                  </div>
                </SelectItem>
                <SelectItem
                  value="gemini-2.5-flash-preview-04-17"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-orange-400" /> 2.5 Flash
                  </div>
                </SelectItem>
                <SelectItem
                  value="gemini-2.5-pro-preview-05-06"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-purple-400" /> 2.5 Pro
                  </div>
                </SelectItem>
                <SelectItem
                  value="gpt-3.5-turbo"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-green-400" /> GPT-3.5 Turbo
                  </div>
                </SelectItem>
                <SelectItem
                  value="gpt-4o"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-blue-400" /> GPT-4o
                  </div>
                </SelectItem>
              </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-2 bg-neutral-700 border-neutral-600 text-neutral-300 focus:ring-neutral-500 rounded-xl rounded-t-sm pl-2  max-w-[100%] sm:max-w-[90%]">
          <div className="flex flex-row items-center text-sm ml-2">
            <Search className="h-4 w-4 mr-2" />
            Engine
          </div>
          <Select value={searchEngine} onValueChange={setSearchEngine}>
            <SelectTrigger className="w-[150px] bg-transparent border-none cursor-pointer">
              <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
              <SelectItem
                value="google"
                className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
              >
                Google
              </SelectItem>
              <SelectItem
                value="duckduckgo"
                className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
              >
                DuckDuckGo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
        {hasHistory && (
          <Button
            className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer rounded-xl rounded-t-sm pl-2 "
            variant="default"
            onClick={() => window.location.reload()}
          >
            <SquarePen size={16} />
            New Search
          </Button>
        )}
      </div>
    </form>
  );
};
