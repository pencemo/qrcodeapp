"use client"
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";

export default function ClientQR({options, setOptions}) {
  
  const [fileExt, setFileExt] = useState("svg");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [qrCode, setQrCode] = useState();
  const ref = useRef(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, [])

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);

  
  const onExtensionChange = (value) => {
    setFileExt(value);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt
    });
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <>
      <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
       className="w-full size-80 border flex items-center justify-center overflow-hidden relative"  >
        <div
        onMouseDown={handleMouseDown}
        className={`absolute  ${dragging ? "cursor-grabbing":"cursor-grab"}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        ref={ref}></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4" >
        <Select onValueChange={onExtensionChange} defaultValue={fileExt}>
      <SelectTrigger className="w-full uppercase">
        <SelectValue placeholder="Select a Formate" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>formate</SelectLabel>
          <SelectItem className='uppercase' value="svg">svg</SelectItem>
          <SelectItem className='uppercase' value="png">png</SelectItem>
          <SelectItem className='uppercase' value="jpeg">jpeg</SelectItem>
          <SelectItem className='uppercase' value="webp">webp</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        <Button  onClick={onDownloadClick}>Download</Button>
      </div>
    </>
  );
} 