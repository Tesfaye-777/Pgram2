"use client";

import type { DestinyProfile, SimulationSave } from "@/types";

const destinyKey = "cyber-destiny-profile";
const simulationKey = "cyber-destiny-simulation";

export function saveDestiny(profile: DestinyProfile) {
  localStorage.setItem(destinyKey, JSON.stringify(profile));
}

export function loadDestiny(): DestinyProfile | null {
  return readJson<DestinyProfile>(destinyKey);
}

export function clearDestiny() {
  localStorage.removeItem(destinyKey);
}

export function saveSimulation(save: SimulationSave) {
  localStorage.setItem(simulationKey, JSON.stringify(save));
}

export function loadSimulation(): SimulationSave | null {
  const save = readJson<SimulationSave>(simulationKey);
  if (!save) {
    return null;
  }

  if (save.records.length === 0 && save.state.pressure === 10) {
    const migrated = { ...save, state: { ...save.state, pressure: 0 } };
    saveSimulation(migrated);
    return migrated;
  }

  return save;
}

export function clearSimulation() {
  localStorage.removeItem(simulationKey);
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
