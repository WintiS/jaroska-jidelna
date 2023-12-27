import {component$, Resource, useResource$, useSignal} from "@builder.io/qwik";

interface Props {
    name?: string,
    location?: string,
}

export const Addmeals = component$((props: Props) => {
    const url = useSignal('https://jaroskajidelna.online//.netlify/functions/meta');
    const fetchMeals = useResource$<any>(async ({track}) => {
        track(() => url.value);
        try {
            const response = await fetch(
                url.value
            );
            const data = await response.json();
            return data.data as string;
        }
        catch (e) {
            return [e]
            console.log(e)
        }

    });
    return (
        <Resource
            value={fetchMeals}
            onPending={() => <div class={"w-96"}><p>{"Loading"}</p></div>}
            onRejected={() => <p>REJECTED</p>}
            onResolved={(jidla) => (
                <div class={"flex justify-center items-center p-8 bg-amber-200 rounded"}>
                    {jidla.map((jidlo, i) => (
                        <div key={i} class={"p-2 rounded bg-amber-100 m-2"}>
                            <a href="#" class={"text-black text-lg"}>{jidlo}</a>
                        </div>
                    ))}
                </div>
            )}
        />
    )
})