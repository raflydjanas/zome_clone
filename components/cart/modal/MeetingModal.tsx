import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  image?: string;
  buttonIcon?: string;
  buttonText?: string;
  children?: React.ReactNode;
  handleClick?: () => void;
};

const MeetingModal = ({ isOpen, onClose, title, className, image, buttonIcon, buttonText, children, handleClick }: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-6">
          {image && <Image src={image} alt="meeting-modal" width={72} height={72} />}
          <h1 className={cn("text-3xl font-bold leading-[42px] mb-2")}>{title}</h1>

          {children}

          <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0" onClick={handleClick}>
            {buttonIcon && <Image src={buttonIcon} alt="button icon" width={13} height={13} />} &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
