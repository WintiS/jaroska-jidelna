import {component$, useSignal, useStore, useTask$} from "@builder.io/qwik";
import type {DocumentHead, RequestHandler} from "@builder.io/qwik-city";
import {MainNav} from "~/components/items/mainnav";
import {HiArrowDownRightOutline} from "@qwikest/icons/heroicons";
import {addmeals} from "~/components/items/addmeals";
import {FirebaseMeals} from "~/components/items/firebasemeals";
import {routeLoader$, server$} from "@builder.io/qwik-city";
import {addDoc, collection, doc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {isServer} from "@builder.io/qwik/build";

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



export default component$(() => {
    const querySignal = useSignal("")
    const renderedMealsArray:{jmeno: string, fileName: string, imageURL: string }[] = useStore([], {deep:true})
    const querySketch = useSignal("")


    useTask$(async ({track, cleanup}) => {
        track(() => querySignal.value)
        const query = querySignal.value
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
                    <div class={"text-white flex text-2xl"}>
                        <HiArrowDownRightOutline class={"w-10 h-10 ml-1"}/>
                    </div>
                </div>
            </div>
            <div>
                <div class={"flex justify-center items-center"}>
                    <div class={""}>
                            <p class={"text-white text-2xl"}>Nevíte jak jídlo vypadá?</p>
                        <form preventdefault:submit onSubmit$={() => {
                            querySignal.value = querySketch.value
                            console.log("submit")
                        }}>
                            <input type="text" placeholder={"Zadejte jeho jméno zde:"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-black border-red-500 border-2 text-lg text-white"} onInput$={(e) => {
                                querySketch.value = (e.target as any).value
                            }}/>
                            <input type="submit" value={"Hledat"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-black border-red-500 border-2 text-lg text-white cursor-pointer"} onClick$={() => {


                            }}/>
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



export const useEditMeals = routeLoader$(async () => {
    const querySnap = await getDocs(colRef)
    querySnap.forEach((meal) => {
        const docRef = doc(colRef, meal.id)
        const normalizedMealName = meal.data().jmeno
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()

        updateDoc(docRef, {
            normalizedMealName: normalizedMealName
        });

    })

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