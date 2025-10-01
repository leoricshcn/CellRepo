import { listTaskCommand } from './listask';
import { taskCommand } from './task';
import type { SlashCommand } from '../types/command';

export const commands: SlashCommand[] = [taskCommand, listTaskCommand];
