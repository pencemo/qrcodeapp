"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ColorNSelect({ options, setOptions, changeItems, id }) {
  const items =
    changeItems == "dotsOptions"
      ? [
          "dots",
          "rounded",
          "classy",
          "classy-rounded",
          "square",
          "extra-rounded",
        ]
      : [
          "dot",
          "rounded",
          "classy",
          "classy-rounded",
          "square",
          "extra-rounded",
        ];

  const [isColor, setColor] = useState(true);

  const handleChange = (color) => {
    setColor(color);
    setOptions((options) => ({
      ...options,
      [changeItems]: {
        type: options[changeItems].type,
        color: options[changeItems].color || "#000000",
        gradient: color
          ? null
          : {
              type: "linear",
              rotation: 0,
              colorStops: [
                { offset: 0, color: "#6a1a4c" },
                { offset: 1, color: "#ff14a5" },
              ],
            },
      },
    }));
  };

  const handleChangeColor = (e) => {
    setOptions((options) => ({
      ...options,
      [changeItems]: {
        ...options[changeItems],
        color: e.target.value,
      },
    }));
  };
  const handleChangeGradient = (offset, color) => {
    setOptions((options) => {
      const current = options[changeItems] || {};
      const currentGradient = current.gradient || {
        type: "linear",
        rotation: 0,
        colorStops: [],
      };

      // check if offset already exists
      const existingIndex = currentGradient.colorStops.findIndex(
        (stop) => stop.offset === offset
      );

      let newColorStops;
      if (existingIndex >= 0) {
        // replace existing
        newColorStops = [...currentGradient.colorStops];
        newColorStops[existingIndex] = { offset, color };
      } else {
        // add new
        newColorStops = [...currentGradient.colorStops, { offset, color }];
      }

      return {
        ...options,
        [changeItems]: {
          ...current,
          gradient: {
            ...currentGradient,
            colorStops: newColorStops,
          },
        },
      };
    });
  };

  const colorUsge = (offset) => {
    const stop = options[changeItems]?.gradient?.colorStops?.find(
      (s) => s.offset === offset
    );
    return stop ? stop?.color : "#000000";
  };

  const style = {
  background: !isColor
    ? `linear-gradient(45deg, ${colorUsge(0)} 0%, ${colorUsge(1)} 100%)`
    : options[changeItems].color,
};

  
  return (
    <div>
      <div className="space-y-2 mt-6 grid md:grid-cols-2">
        <Label>{id}</Label>
        <div className="flex gap-4 mt-2">
          <Popover>
            <PopoverTrigger className="w-full">
              <div style={style}  className=" w-full h-9 rounded-sm border flex items-center justify-center text-xs text-muted-foreground/60 cursor-pointer">
                {isColor ? "Color" : "Gradient"}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid grid-cols-2 gap-1 mb-4">
                <Button
                  variant={isColor ? "default" : "outline"}
                  onClick={() => handleChange(true)}
                  className="h-8 text-xs rounded-sm font-light dark:border-accent"
                >
                  Color
                </Button>
                <Button
                  variant={!isColor ? "default" : "outline"}
                  onClick={() => handleChange(false)}
                  className="h-8 text-xs rounded-sm font-light dark:border-accent"
                >
                  Gradient
                </Button>
              </div>
              {!isColor ? (
                <div className="space-y-2">
                  {/* <h1 className="text-xs text-foreground font-normal  ">Select Gradient</h1> */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="space-y-1">
                      <h1 className="text-xs text-foreground font-normal">
                        Color 1
                      </h1>
                      <label
                        className="  w-full h-9 rounded-sm border flex items-center justify-center text-xs text-muted-foreground/60 cursor-pointer"
                        htmlFor={id}
                        style={{ backgroundColor: colorUsge(0) }}
                      >
                        Select here
                      </label>
                      <input
                        className="sr-only"
                        onChange={(e) =>
                          handleChangeGradient(0, e.target.value)
                        }
                        id={id}
                        value={options[changeItems].color}
                        type="color"
                      />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-xs text-foreground font-normal">
                        Color 2
                      </h1>
                      <label
                        className="  w-full h-9 rounded-sm border flex items-center justify-center text-xs text-muted-foreground/60 cursor-pointer"
                        htmlFor={id}
                        style={{ backgroundColor: colorUsge(1) }}
                      >
                        Select here
                      </label>
                      <input
                        className="sr-only"
                        onChange={(e) =>
                          handleChangeGradient(1, e.target.value)
                        }
                        id={id}
                        value={options[changeItems].color}
                        type="color"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2 w-full border-amber-300">
                    <Select
                      onValueChange={(value) =>
                        setOptions((options) => ({
                          ...options,
                          [changeItems]: {
                            ...options[changeItems],
                            gradient: {
                              ...options[changeItems].gradient,
                              type: value,
                            },
                          },
                        }))
                      }
                      defaultValue={options[changeItems].gradient.type}
                    >
                      <SelectTrigger className="w-full capitalize max-w-[200px] border-accent text-xs">
                        <SelectValue placeholder="Select a Formate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>formate</SelectLabel>
                          {["linear", "radial"].map((item) => {
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
                      type="number"
                      disabled={
                        options[changeItems].gradient.type === "radial"
                          ? true
                          : false
                      }
                      value={options[changeItems].gradient.rotation}
                      onChange={(e) => {
                        setOptions((options) => ({
                          ...options,
                          [changeItems]: {
                            ...options[changeItems],
                            gradient: {
                              ...options[changeItems].gradient,
                              rotation: e.target.value,
                            },
                          },
                        }));
                      }}
                      className="border-accent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h1 className="text-xs text-foreground font-normal  ">
                    Select color
                  </h1>
                  <label
                    className="  w-full h-9 rounded-sm border flex items-center justify-center text-xs text-muted-foreground/60 cursor-pointer"
                    htmlFor={id}
                    style={{ backgroundColor: options[changeItems].color }}
                  >
                    Select here
                  </label>
                  <Input
                    value={options[changeItems].color}
                    onChange={handleChangeColor}
                    className="border-accent"
                  />
                  <input
                    className="sr-only"
                    onChange={handleChangeColor}
                    id={id}
                    value={options[changeItems].color}
                    type="color"
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Select
            onValueChange={(value) =>
              setOptions((options) => ({
                ...options,
                [changeItems]: {
                  ...options[changeItems],
                  type: value,
                },
              }))
            }
            defaultValue={options[changeItems].type}
          >
            <SelectTrigger className="w-full capitalize max-w-[200px]">
              <SelectValue placeholder="Select a Formate" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>formate</SelectLabel>
                {items.map((item) => {
                  return (
                    <SelectItem className="capitalize" value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ColorNSelect;
