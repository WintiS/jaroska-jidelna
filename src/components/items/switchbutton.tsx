import {component$, Signal, useSignal} from "@builder.io/qwik";

interface Props {
    state: Signal<boolean>,
}

export const Switchbutton = component$((props:Props) => {
    const content = useSignal("Dnes")
    return(
        <div class={"text-white"}>
            <button onClick$={() => {
                props.state.value? content.value = "Včera" : content.value = "Dnes"
                props.state.value? props.state.value = false : props.state.value = true
            }}>{content.value}</button>
        </div>
    )
})