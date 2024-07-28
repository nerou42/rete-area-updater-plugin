import { ClassicPreset, GetSchemes } from "rete";

export type Node = ClassicPreset.Node & {
  addIOChangedListener(listener: IOChangedListener): void;
  removeIOChangedListener(listener: IOChangedListener): void;
}

export type Connection = ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>;

export type Scheme = GetSchemes<Node, Connection>;

export type IOChangedListener = () => void | Promise<void>;