import {component$, Signal, useSignal} from "@builder.io/qwik";

interface Props {
    state: Signal<boolean>,
}

export const Switchbutton = component$((props:Props) => {
    const content = useSignal("Dnes↑")
    return(
        <div class={"text-white w-4/5 bg-gray-900 pt-2.5 pb-2.5 text-center border-b border-white"}>
            <button class={"w-1/2"} onClick$={() => {
                props.state.value? content.value = "Včera↓" : content.value = "Dnes↑"
                props.state.value? props.state.value = false : props.state.value = true
            }}>{content.value}</button>
        </div>
    )
})