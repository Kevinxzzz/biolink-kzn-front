export interface Link {
  id: string;
  title: string;
  url: string;
  clicks: number;
  order: number;
  
  /** Se o link está sendo ativamente selecionado pela plataforma neste exato momento */
  isActive: boolean;
  
  /** Se o link está "ligado", ou seja, pode receber tráfego */
  isEnabled: boolean;
  
  /** Se o link participa do pool de sorteio automático */
  rotationPool: boolean;
}

export interface ScheduledChange {
  id: string;
  linkId: string;
  scheduledAt: string;
}

export interface RotationSettings {
  isActive: boolean;
  intervalMinutes: number;
}
