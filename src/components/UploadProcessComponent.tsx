import { Button } from "@/components/ui/button";
import React from "react";
import {getTranslations} from 'next-intl/server';
import { Check, Pause } from "lucide-react";

import { cn } from "@/lib/utils";
import AnimatedLoadingCircle from "@/components/AnimatedLoadingCircle";

interface UploadProcessComponentProps {
  isWaiting: boolean;
  isProcessing: boolean;
  isFinished: boolean;
  text: string;
}

const UploadProcessComponent = async ({
  isWaiting,
  isProcessing,
  isFinished,
  text
}: UploadProcessComponentProps) => {
  const t = await getTranslations();


  const textToShow = isWaiting
    ? t("waiting")
    : isFinished
      ? t("success")
      : text;
  const cursorStyling = isWaiting || isProcessing ? "cursor-wait" : "cursor-default";

  return (
    <div>
      <Button
        type="button"
        className={cn(
          cursorStyling,
          "cursor- inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out"
        )}
      >
        {isWaiting && <Pause />}
        {isProcessing && <AnimatedLoadingCircle />}
        {isFinished && <Check />}
        {textToShow}
      </Button>
    </div>
  );
};

export default UploadProcessComponent;
