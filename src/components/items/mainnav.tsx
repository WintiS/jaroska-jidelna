import {component$} from "@builder.io/qwik";
import {Link} from "@builder.io/qwik-city";

interface Props{
    name: string,
    location: string,
}
export const MainNav = component$((props:Props) => {
    return(
        <div class={"py-7"} id={"linkig"}>
            <Link href={props.location} class={`border-red-500 border-2 rounded-md px-6 py-4 text-white`}>
                {props.name}
            </Link>
        </div>
    )
})