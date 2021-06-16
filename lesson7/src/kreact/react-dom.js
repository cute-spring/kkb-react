// vnode 虚拟dom

import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";

// node dom节点
function render(vnode, container) {
  console.log("vnode", vnode); //sy-log
  const FiberRoot = {
    type: container.nodeName.toLocaleLowerCase(),
    stateNode: container,
    props: {children: vnode},
  };

  scheduleUpdateOnFiber(FiberRoot);
}

export default {render};
