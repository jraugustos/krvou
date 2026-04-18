"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface CustomCategoryInputProps {
  onAdd: (name: string) => void;
}

export function CustomCategoryInput({ onAdd }: CustomCategoryInputProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    setOpen(false);
  }

  function handleCancel() {
    setName("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="pill-outline"
        size="sm"
        className="self-start"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Adicionar categoria
      </Button>
    );
  }

  return (
    <Card padding="sm" className="flex flex-col gap-3">
      <label
        htmlFor="custom-category-name"
        className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light"
      >
        Nova categoria
      </label>
      <Input
        id="custom-category-name"
        type="text"
        variant="default"
        placeholder="Ex: Técnico destaque do torneio"
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
          if (e.key === "Escape") handleCancel();
        }}
        maxLength={80}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="pill"
          size="sm"
          onClick={handleAdd}
          disabled={!name.trim()}
          className="flex-1"
        >
          Adicionar
        </Button>
        <Button
          type="button"
          variant="pill-outline"
          size="sm"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </Card>
  );
}
