import { NodeEditor, NodeId, Root, Scope } from "rete";
import { IOChangedListener, Scheme } from "./types";
import { Area2D, AreaPlugin } from "rete-area-plugin";

/**
 * This is a plugin for the area-plugin and handles rerendering of nodes after inputs, outputs, Controls have been dynamically added or removed
 */
export class AutoUpdatePlugin<S extends Scheme> extends Scope<never, [Area2D<S>, Root<S>]> {

  constructor() {
    super('AutoUpdatePlugin');
  }

  override setParent(scope: Scope<Area2D<S>, [Root<S>]>): void {
    super.setParent(scope);

    const area = this.parentScope<AreaPlugin<S>>(AreaPlugin);
    const editor = area.parentScope<NodeEditor<S>>(NodeEditor<S>);

    const listeners: Record<NodeId, IOChangedListener> = {};
    const pipe = async (signal: Area2D<S> | Root<S>) => {
      switch (signal.type) {
        case 'nodecreated':
          const listener: IOChangedListener = async () => {
            area.update('node', signal.data.id);
          }
          signal.data.addIOChangedListener(listener);
          listeners[signal.data.id] = listener;
          break;
        case 'noderemoved':
          signal.data.removeIOChangedListener(listeners[signal.data.id]);
          break;
      };
      return signal;
    };

    // run pipe for all nodes that have been created previously
    editor.getNodes().forEach(data => pipe({type: 'nodecreated', data}));

    this.addPipe(pipe);
  }
}