import {component$, } from "@builder.io/qwik";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import {getStorage, ref, uploadBytes} from "firebase/storage"
import {initializeApp} from "firebase/app";
import {server$} from "@builder.io/qwik-city";
import {normalize} from "~/routes";


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
const colRefNeOff = collection(db, "neofJidla")



interface Props {
    name: string
}


const pushMeal = server$(async (file:File, fileName:string, jmeno:string) => {
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file)
    await addDoc(colRefNeOff, {
        fileName: fileName,
        jmeno: jmeno,
        normalizedMealName: normalize(jmeno)
    })
    console.log("uploaded")
})




export const UploadMeal = component$((props:Props) => {


    return(
        <div class={"w-4/5 bg-gray-900 py-2.5 px-4 rounded"}>
            <div class={"text-white flex items-center justify-center"}>
                <div class={"w-2/3"}>
                    <p>{props.name}</p>
                </div>
                <div class={"flex justify-center items-center"}>
                    <label for={props.name} class={"border-solid border-2 border-red-500 px-3 py-2 rounded cursor-pointer"}>
                        <span>Nahrát fotku jídla</span>
                    </label>
                    <input type="file" accept={"image/*"} id={props.name} class={"hidden"} onChange$={async (e) => {
                        // @ts-ignore
                        const file = (e.target as HTMLInputElement).files[0]
                        if (file){
                            const storageRef = ref(storage, file.name);
                            await uploadBytes(storageRef, file)
                            await addDoc(colRefNeOff, {
                                fileName: file.name,
                                jmeno: props.name,
                                normalizedMealName: normalize(props.name)
                            })
                            console.log("uploaded" + props.name)
                        }
                    }}/>
                </div>
            </div>
        </div>
    )
})

