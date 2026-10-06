import type { On } from "claude-code";
import { registerCleanView } from "./clean-view";
export function register(on: On) { registerCleanView(on); }
