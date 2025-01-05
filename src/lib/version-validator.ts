 const isOpenSource = (vexor: any) => {
    return Object.keys(vexor.platforms || {}).length > 0;
}

export const VersionChecker = {
    isOpenSource
}