import { Vexor } from "@/methods";

 const isOpenSource = (vexor: Vexor) => {
    return Object.keys(vexor.platforms || {}).length > 0;
}

export const VersionChecker = {
    isOpenSource
}