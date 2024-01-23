import {component$, useSignal, useStore, useTask$} from "@builder.io/qwik";
import type {DocumentHead, RequestHandler} from "@builder.io/qwik-city";
import {MainNav} from "~/components/items/mainnav";
import {HiArrowDownRightOutline} from "@qwikest/icons/heroicons";
import {routeLoader$, server$} from "@builder.io/qwik-city";
import {addDoc, collection, doc, getDocs, getFirestore, query} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {isServer} from "@builder.io/qwik/build";
import {Switchbutton} from "~/components/items/switchbutton";

const firebaseConfig = {
    apiKey: "AIzaSyA6njn4hz3Yz7dC6LAwBY5EB6do3oJxkTo",
    authDomain: "jaroska-jidelna.firebaseapp.com",
    projectId: "jaroska-jidelna",
    storageBucket: "jaroska-jidelna.appspot.com",
    messagingSenderId: "947035882834",
    appId: "1:947035882834:web:3965f23658d5640c3ca68b",
    measurementId: "G-WHSTF0W8B9"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore()
const colRef = collection(db, "meals")

export function exportQueryToUrl(query: string) {
    const urlQuery = new URLSearchParams()
    if (query) urlQuery.set("q", query)

    return urlQuery.toString()

}

export function getCurrentDate(setBack:number): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = today.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${Number(day)-setBack}`;
    return formattedDate;
}

interface MealItem {
    item: {
        mealName: string;
    };
}


export default component$(() => {
    const state = useSignal(true)
    const querySignal = useSignal("")
    const renderedMealsArray:{jmeno: string, fileName: string, imageURL: string }[] = useStore([], {deep:true})
    const querySketch = useSignal("")

    const useQuery = useQLoader()
    const jaroskaMeals = useJaroskaMeals()
    const yesterdayMeals = useJaroskaMealsYesterday()


    useTask$(async ({track, cleanup}) => {
        track(() => querySignal.value)
        const query = isServer? useQuery.value : querySignal.value
        const querySnap = await getDocs(colRef)
        console.log("RUN")
        isServer? console.log("running usetask$ on server") : renderedMealsArray.length = 0
        querySnap.forEach((meal) => {

            if (query) {
                const normalizedFilter = query
                    .normalize("NFD") // Normalize diacritics
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                const normalizedMealName = meal.data().jmeno
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()

                if (normalizedMealName.includes(normalizedFilter)) {

                    renderedMealsArray.push(meal.data() as any)
                } else {
                    return
                }

            } else {
                renderedMealsArray.push(meal.data() as any)
            }
        })
        cleanup(() => renderedMealsArray.length = 0)
    })

    return (
        <main class="bg-black">
            <div class={"h-70 bg-black flex justify-center"}>
                <div class={"flex flex-col items-center justify-center"}>
                    <MainNav name={"Vyhledat fotku jídla"} location={"#linkig"}/>
                    <MainNav name={"Nahrát fotku jílda"} location={'#'}/>
                </div>
            </div>
            <div>
                <div>
                    <Switchbutton state={state} />
                    <div>

                        {
                            state.value?
                                jaroskaMeals.value.map((e:string) => {

                                    return(
                                        <div class={"text-white"} key={e}>{e}</div>
                                    )
                                })
                                :
                                yesterdayMeals.value.map((e:string) => {

                                    return(
                                        <div class={"text-white"} key={e}>{e}</div>
                                    )
                                })

                        }
                    </div>
                </div>
            </div>
            <div>
                <div class={"flex justify-center items-center"}>
                    <div class={""}>
                            <p class={"text-white text-2xl"}>Nevíte jak jídlo vypadá?</p>
                        <form preventdefault:submit onSubmit$={() => {
                            querySignal.value = querySketch.value
                            console.log(jaroskaMeals.value)
                            window.history.replaceState({}, "", "?" + exportQueryToUrl(querySignal.value));

                        }}>
                            <input type="text" placeholder={"Zadejte jeho jméno zde:"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-black border-red-500 border-2 text-lg text-white max-w-lg"} value={useQuery.value} onInput$={(e) => {
                                querySketch.value = (e.target as any).value
                            }}/>
                            <input type="submit" value={"Hledat"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-black border-red-500 border-2 text-lg text-white cursor-pointer"} />
                        </form>
                    </div>
                </div>
                <div class={"flex flex-wrap justify-center"}>
                    {
                        renderedMealsArray.map((e) => {

                            let modifiedURL = (e.imageURL)
                            let extension = ("")
                            let result = ([""])

                            result = e.imageURL.split(".png")
                            extension = ".png"
                            if (result[1]){
                                modifiedURL =  result[0] + "_200x200" + extension + result[1]
                            }

                            if(!result[1]){
                                result = e.imageURL.split(".jpeg")
                                extension = ".jpeg"
                                modifiedURL =  result[0] + "_200x200" + extension + result[1]
                            }
                            if(!result[1]){
                                result = e.imageURL.split(".jpg")
                                extension = ".jpg"
                                modifiedURL =  result[0] + "_200x200" + extension + result[1]
                            }



                            return(
                                <div key={e.fileName} class={"flex items-center flex-col shadow-gray-700 shadow mt-3 pb-1.5 mx-1 rounded-xl"}>
                                    <div>
                                        <img src={modifiedURL} alt={e.jmeno} loading={"lazy"} class={"rounded"} width={180} height={180}/>
                                    </div>
                                    <div class={"w-40 mt-1"}>
                                        <p class={"text-white text-sm"}>{e.jmeno}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </main>
    );
});

export const useQLoader = routeLoader$(async ({query}) => {
    return query.get("q") || ""
})


const serverMeals = server$(async function (query: string){
    const mealArray: { jmeno: string, fileName: string, imageURL: string }[] = []
    const querySnap = await getDocs(colRef)

    querySnap.forEach((meal) => {
        if (query) {
            const normalizedFilter = query
                .normalize("NFD") // Normalize diacritics
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            const normalizedMealName = meal.data().jmeno
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()

            if (normalizedMealName.includes(normalizedFilter)) {
                mealArray.push(meal.data() as any)
            } else {
                return
            }

        } else {
            mealArray.push(meal.data() as any)
        }
    })

    return mealArray
})

export const useJaroskaMeals = routeLoader$(async() => {
    const currentDate = getCurrentDate(1)
    const res = await fetch(`https://jidelna.jaroska.cz/webkredit/Api/Ordering/Menu?Dates=${currentDate}T23%3A00%3A00.000Z&CanteenId=1`)
    const meals = await res.json()
    const rows = meals.groups[0].rows
    return rows.map((meal: MealItem) => meal.item.mealName)
})

export const useJaroskaMealsYesterday = routeLoader$(async () => {
    const currentDate = getCurrentDate(2)
    const res = await fetch(`https://jidelna.jaroska.cz/webkredit/Api/Ordering/Menu?Dates=${currentDate}T23%3A00%3A00.000Z&CanteenId=1`)
    const meals = await res.json()
    const rows = meals.groups[0].rows
    return rows.map((meal: MealItem) => meal.item.mealName)
})

export const head: DocumentHead = {
    title: "jaroska.jidena online",
    meta: [
        {
            name: "description",
            content: "Vyhledejte si, jak jídla na Jarošce vypadají",
        },
        {
            name: "keywords",
            content: "jaroška, jídelna, obědy, oběd, školní, škola"
        },
    ],
};