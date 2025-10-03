"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCodeIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ClientQR from "@/components/qrcode/ClientQR";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ColorNSelect from "@/components/qrcode/ColorNSelect";
import ModeQr from "@/components/qrcode/ModeQr";
import { QRmodels } from "@/components/qrcode/options";

function page() {
  const [dataURL, setDataUrl] = useState("https://qrcodeapp-seven.vercel.app/");
  const [logo, setLogo] = useState(null);
  const [options, setOptions] = useState({
    width: 200,
    height: 200,
    type: "svg",
    data: "https://qrcodeapp-seven.vercel.app/",
    image:
      "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      color: "#212121",
      type: "square", 
    },
    cornersSquareOptions: {
      color: "#212121",
      type: "extra-rounded", // "dot", "square", "extra-rounded"
    },
    cornersDotOptions: {
      color: "#212121",
      type: "dot", // "square", "dot"
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });
  const onDataChange = (event) => {
    setDataUrl(event.target.value);
  };

  useEffect(() => {
    const timr = setTimeout(() => {
      setOptions((options) => ({
        ...options,
        data: dataURL,
      }));
    }, 1000);
    return () => clearTimeout(timr);
  }, [dataURL]);

  useEffect(() => {
    setOptions((options) => ({
      ...options,
      image: logo ? URL.createObjectURL(logo) : "",
    }));
  }, [logo]);

  const handleChange = (number, min, max, setValue) => {
    const newValue = parseFloat(number) || 0;
    // Clamp the value between min and max
    const clampedValue = Math.min(max, Math.max(min, newValue));
    setValue(clampedValue);
  };

  return (
    <div>
      <div className="base grid md:grid-cols-6 mt-10 gap-4">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Create QR Code</CardTitle>
            <CardDescription>
              to create qr code enter your text or link here
            </CardDescription>
            <CardAction>
              <QrCodeIcon />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 w-full">
              <Textarea
                onChange={onDataChange}
                value={dataURL}
                className="h-40"
                placeholder="Type your text or link here."
              />
              <div>
                <Label htmlFor="size">Qr code options</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <Select
                      onValueChange={(value) =>
                        setOptions((options) => ({
                          ...options,
                          "shape": value,
                        }))
                      }
                      defaultValue={options.shape}
                    >
                      <SelectTrigger className="w-full capitalize max-w-[200px] border-accent text-xs">
                        <SelectValue placeholder="Select a Formate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>formate</SelectLabel>
                          {["square", "circle"].map((item) => {
                            return (
                              <SelectItem
                                className="capitalize"
                                value={item}
                                key={item}
                              >
                                {item}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  <Input
                    max={10000}
                    type="number"
                    id="width"
                    value={options.width}
                    onChange={(e) =>
                      handleChange(e.target.value, 0, 10000, (value) =>
                        setOptions((options) => ({
                          ...options,
                          width: value,
                          height: value,
                        }))
                      )
                    }
                  />
                  <Input
                    max={40}
                    min={0}
                    type="number"
                    id="width"
                    value={options.margin}
                    onChange={(e) =>
                      handleChange(e.target.value, 0, 40, (value) =>
                        setOptions((options) => ({ ...options, margin: value }))
                      )
                    }
                  />
                  <label
                    className="max-w-[200px] w-full h-9 rounded-sm border flex items-center justify-center text-xs text-muted-foreground/60 cursor-pointer"
                    htmlFor="backgroundOptions"
                    style={{ backgroundColor: options.backgroundOptions.color }}
                  >
                    {options.backgroundOptions.color}
                  </label>
                  <input
                    className="sr-only"
                    onChange={(e) =>
                      setOptions((options) => ({
                        ...options,
                        backgroundOptions: {
                          ...options.backgroundOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    id="backgroundOptions"
                    type="color"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <Label>Image Optins</Label>
                <div className="flex gap-4 mt-2">
                  <Input
                    onChange={(e) => setLogo(e.target.files[0])}
                    id="picture"
                    type="file"
                    accept="image/*"
                  />
                  <Slider
                    defaultValue={[5]}
                    onValueChange={(value) => {
                      setOptions((options) => ({
                        ...options,
                        imageOptions: {
                          ...options.imageOptions,
                          margin: value,
                        },
                      }));
                    }}
                    min={0}
                    max={20}
                    step={2}
                  />
                </div>
              </div>
              <ColorNSelect options={options} setOptions={setOptions} changeItems={"dotsOptions"} id="Dots Options"/>
              <ColorNSelect options={options} setOptions={setOptions} changeItems={"cornersSquareOptions"} id="Corners Square Options"/>
              <ColorNSelect options={options} setOptions={setOptions} changeItems={"cornersDotOptions"} id="Corners Dot Options"/>
            </div>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Qr</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full ">
              <ClientQR options={options} setOptions={setOptions} />
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {QRmodels.map((item, i) => {
                return <ModeQr key={i} options={item} setOptions={setOptions}/>
              })
              }
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
