"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { DateWheelPicker } from "@/components/DateWheelPicker";
import { birthHourOptions } from "@/lib/constants";
import { generateDestinyProfile } from "@/lib/destinySkill";
import { clearSimulation, saveDestiny } from "@/lib/storage";
import type { BirthHour, Gender } from "@/types";

export function CharacterForm() {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState({ year: 1995, month: 1, day: 1 });
  const [birthTime, setBirthTime] = useState<BirthHour>("chen");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请先填写姓名，再开启命册。");
      nameInputRef.current?.focus();
      return;
    }

    const normalizedBirthDate = `${birthDate.year}-${String(birthDate.month).padStart(2, "0")}-${String(
      birthDate.day
    ).padStart(2, "0")}`;
    const profile = generateDestinyProfile({
      name: name.trim(),
      birthDate: normalizedBirthDate,
      birthTime,
      gender
    });
    saveDestiny(profile);
    clearSimulation();
    router.push("/result");
  }

  return (
    <form onSubmit={handleSubmit} className="xian-card scroll-glow rounded-lg p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-jade">姓名</span>
          <input
            ref={nameInputRef}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="输入你的角色名"
            className={`w-full rounded-md border bg-ink/55 px-4 py-3 text-parchment outline-none transition placeholder:text-parchment/42 focus:border-jade focus:shadow-jade ${
              error ? "border-cinnabar/70 shadow-cinnabar" : "border-gold/25"
            }`}
          />
        </label>
        <div className="space-y-2 md:col-span-2">
          <span className="text-sm text-jade">出生日期</span>
          <DateWheelPicker
            year={birthDate.year}
            month={birthDate.month}
            day={birthDate.day}
            onChange={setBirthDate}
          />
        </div>
        <label className="space-y-2">
          <span className="text-sm text-jade">出生时辰</span>
          <select
            value={birthTime}
            onChange={(event) => setBirthTime(event.target.value as BirthHour)}
            className="w-full rounded-md border border-gold/25 bg-ink/55 px-4 py-3 text-parchment outline-none transition focus:border-jade focus:shadow-jade"
          >
            {birthHourOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}（{option.range}）
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-jade">性别</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            className="w-full rounded-md border border-gold/25 bg-ink/55 px-4 py-3 text-parchment outline-none transition focus:border-jade focus:shadow-jade"
          >
            <option value="unspecified">不指定</option>
            <option value="female">女性</option>
            <option value="male">男性</option>
            <option value="other">其他</option>
          </select>
        </label>
      </div>
      {error ? (
        <div className="mt-4 rounded-md border border-cinnabar/45 bg-cinnabar/12 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        className="mt-6 w-full rounded-md border border-gold/70 bg-gold/16 px-5 py-3 font-semibold text-yellow-50 shadow-gold transition hover:bg-gold/24"
      >
        开启命册
      </button>
    </form>
  );
}
