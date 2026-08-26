"use client";

import { IPhoneTimerPicker, TimerValue } from "@/components/ui/IPhoneTimerPicker";

interface TimerConfigProps {
  value: TimerValue;
  onChange: (value: TimerValue) => void;
}

export function TimerConfig({ value, onChange }: TimerConfigProps) {
  return <IPhoneTimerPicker value={value} onChange={onChange} />;
}
