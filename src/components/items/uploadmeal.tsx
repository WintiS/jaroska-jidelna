import {component$, useSignal,} from "@builder.io/qwik";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import {initializeApp} from "firebase/app";
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
    name: string,
}


export const UploadMeal = component$((props:Props) => {

    const track = useSignal(false)
    const finished = useSignal(false)
    return(
        <div class={"w-4/5 bg-gray-900 py-2.5 px-4 rounded"}>
            <div class={"text-white flex items-center justify-center"}>
                <div class={"w-2/3"}>
                    <p>{props.name}</p>
                </div>
                <div class={"flex justify-center items-center w-1/2"}>
                    <label for={props.name} class={"border-solid border-2 border-red-500 px-3 py-2 rounded cursor-pointer"}>
                        <div class="relative ">
                            {track.value?
                                <div class="relative inline-flex">
                                    <div class="w-7 h-7 bg-red-500 rounded-full mt-1"></div>
                                    <div class="w-7 h-7 bg-red-500 rounded-full absolute animate-ping mt-1"></div>
                                    <div class="w-7 h-7 bg-red-500 rounded-full absolute animate-pulse mt-1"></div>
                                </div>
                            :
                            finished?
                                <p>Nahrát fotku</p>
                            :
                                <p>Nahráno</p>}
                        </div>
                    </label>
                    <input type="file" accept={"image/*"} id={props.name} class={"hidden"} onChange$={async (e) => {
                        // @ts-ignore
                        const file = (e.target as HTMLInputElement).files[0]
                        if (file){
                            const storageRef = ref(storage, file.name);
                            track.value = true
                            await uploadBytes(storageRef, file)

                            const downloadURL = await getDownloadURL(ref(storage, file.name))
                            await addDoc(colRefNeOff, {
                                fileName: file.name,
                                jmeno: props.name,
                                normalizedMealName: normalize(props.name),
                                imageURL: downloadURL
                            })
                            console.log("added doc")
                            finished.value = true
                            track.value = false

                        }
                    }}/>
                </div>
            </div>
        </div>
    )
})

