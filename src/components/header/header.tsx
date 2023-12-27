import { component$ } from "@builder.io/qwik";

export default component$(() => {
    return (
        <header class={"bg-red-500 px-2 py-2.5 flex justify-center"}>
            <p>Nevíte, jak nějaké jídlo, co si objednáváte, vypadá? <br/>
                Vyhledejte si ho zde!
            </p>
        </header>
    );
});