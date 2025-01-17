import { component$, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { MainNav } from "~/components/items/mainnav";
import { collection, getDocs, getFirestore, limit, orderBy, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { isServer } from "@builder.io/qwik/build";
import { Switchbutton } from "~/components/items/switchbutton";
import { UploadMeal } from "~/components/items/uploadmeal";
import { Fetchedmeal } from "~/components/items/fetchedmeal";

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
const limititedColRef = query(colRef, orderBy("jmeno"), limit(12))
let isquery: string;

export function exportQueryToUrl(query: string) {
  const urlQuery = new URLSearchParams()
  if (query) urlQuery.set("q", query)
  isquery = query;
  return urlQuery.toString()

}


function getDate(setback: number): string {
  const today = new Date();
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - setback);

  const year = dayBeforeYesterday.getFullYear();
  const month = (dayBeforeYesterday.getMonth() + 1).toString().padStart(2, '0');
  const day = dayBeforeYesterday.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const normalize = (element: string): string => {
  return element
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};


interface MealItem {
  item: {
    mealName: string;
  };
}

export interface Meal {
  jmeno: string,
  fileName: string,
  imageURL: string
}


export default component$(() => {

  const useQuery = useQLoader()
  const jaroskaMeals = useJaroskaMeals()
  const yesterdayMeals = useJaroskaMealsYesterday()

  const state = useSignal(true)
  const querySignal = useSignal(useQuery.value)
  const querySketch = useSignal("")
  const renderedMealsArray: { jmeno: string, fileName: string, imageURL: string }[] = useStore([], { deep: true })
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => querySignal.value)
    const query = querySignal.value
    if(renderedMealsArray.length != 0){
      renderedMealsArray.length = 0;
      console.log("setting size of an array to 0")
    }
    let querySnap
    query ? querySnap = await getDocs(colRef) : querySnap = await getDocs(limititedColRef)
    isServer ? console.log("running usetask$ on server") : console.log("running usetask$ on client")
    querySnap.forEach((meal) => {
      if (query) {
        const normalizedFilter = normalize(query)
        const normalizedMealName = normalize(meal.data().jmeno)

        if (normalizedMealName.includes(normalizedFilter)) {
          renderedMealsArray.push(meal.data() as Meal)
        }
      } else {
        renderedMealsArray.push(meal.data() as Meal)
      }
    })

  })

  return (
    <main class="bg-blackg">
      <div class={"h-70 flex justify-center"}>
        <div class={"flex flex-col items-center justify-center"}>
          <MainNav name={"Vyhledat fotku jídla"} location={"#search"} />
          <MainNav name={"Nahrát fotku jílda"} location={'#upload'} />
        </div>
      </div>
      <div>
        <div id={"upload"}>
          <div class="flex justify-center items-center">
            <Switchbutton state={state} />
          </div>
          <div class={"flex justify-center flex-col items-center gap-2"}>

            {
              state.value ?
                jaroskaMeals.value.map((e: string) => {
                  return (<UploadMeal name={e} key={e} />)
                })
                :
                yesterdayMeals.value.map((e: string) => {
                  return (<UploadMeal name={e} key={e} />)
                })
            }
          </div>
        </div>
      </div>
      <div>
        <div class={"flex justify-center items-center mt-20"}>
          <div id={"search"}>
            <p class={"text-white text-2xl"}>Nevíte jak jídlo vypadá?</p>
            <form preventdefault:submit onSubmit$={() => {

              querySignal.value = querySketch.value;
              window.history.replaceState({}, "", "?" + exportQueryToUrl(querySignal.value));
              window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                  });

            }}>
              <input type="text" placeholder={isquery ? isquery : "Zadejte jeho jméno zde:"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-blackg border-red-500 border-2 text-lg text-white max-w-lg"} value={isquery} onInput$={(e) => {
                querySketch.value = (e.target as HTMLInputElement).value
              }} />
              <input type="submit" value={"Hledat"} class={"mt-3 mb-6 px-4 py-2.5 rounded bg-blackg border-red-500 border-2 text-lg text-white cursor-pointer"} />
            </form>
          </div>
        </div>
        <div class={"flex flex-wrap justify-center"}>
          {
            renderedMealsArray.map((e) => {
              return (
                <Fetchedmeal jmeno={e.jmeno} fileName={e.fileName} imageURL={e.imageURL} key={e.imageURL} />
              )
            })
          }
        </div>
      </div>
    </main>
  );
});

export const useQLoader = routeLoader$(async ({ query }) => {
  return query.get("q") || ""
})


export const useJaroskaMeals = routeLoader$(async () => {
  const currentDate = getDate(1)
  const res = await fetch(`https://jidelna.jaroska.cz/webkredit/Api/Ordering/Menu?Dates=${currentDate}T22%3A00%3A00.000Z&CanteenId=1`)
  const meals = await res.json()
  if (meals.groups[0]) {
    const rows = meals.groups[0].rows
    return rows.map((meal: MealItem) => meal.item.mealName)
  } else {
    return [currentDate]
  }
})

export const useJaroskaMealsYesterday = routeLoader$(async () => {
  const currentDate = getDate(2)
  const res = await fetch(`https://jidelna.jaroska.cz/webkredit/Api/Ordering/Menu?Dates=${currentDate}T22%3A00%3A00.000Z&CanteenId=1`)
  const meals = await res.json()
  if (meals.groups[0]) {
    const rows = meals.groups[0].rows
    return rows.map((meal: MealItem) => meal.item.mealName)
  } else {
    return ["Včera nebyla chálka"]

  }
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
