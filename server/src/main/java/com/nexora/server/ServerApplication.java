package com.nexora.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import java.util.List;
import com.nexora.server.model.learningplan.Cuisine;
import com.nexora.server.model.learningplan.Recipe;
import com.nexora.server.repository.learningplan.CuisineRepository;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	CommandLineRunner seedData(CuisineRepository cuisineRepo) {
		return args -> {

			if (!cuisineRepo.existsByName("Sri Lankan TasteHeaven")) {
				// ------------------ Sri Lankan ------------------
				Cuisine sriLankan = new Cuisine();
				sriLankan.setName("Sri Lankan TasteHeaven");
				sriLankan.setLevel("beginner");
				sriLankan.setDescription(
						"A culinary treasure trove from the pearl of the Indian Ocean - think fiery curries and aromatic spices that dance on your tongue like a Kandyan drumming parade.");
				sriLankan.setImage("https://travelseewrite.com/wp-content/uploads/2023/08/sl-food.jpeg");

				Recipe dhal = new Recipe();
				dhal.setName("Dhal Curry");
				dhal.setTime("45 mins");
				dhal.setImage("https://myloveofbaking.com/wp-content/uploads/2020/10/IMG_8497-1200x1200.jpg");
				dhal.setIngredients(List.of("1 cup red lentils", "1 small onion", "2 cloves garlic"));
				dhal.setMethod("1. Rinse lentils. 2. Simmer. 3. Temper aromatics. 4. Mix.");

				Recipe koththu = new Recipe();
				koththu.setName("Koththu");
				koththu.setTime("40 mins");
				koththu.setImage(
						"https://cheapandcheerfulcooking.com/wp-content/uploads/2023/02/vegan-kottu-roti-1.jpg");
				koththu.setIngredients(List.of("4 godhamba rotis", "2 eggs", "shredded cabbage"));
				koththu.setMethod("1. Fry veggies. 2. Add roti + egg. 3. Toss well.");

				Recipe eggHoppers = new Recipe();
				eggHoppers.setName("Egg Hoppers");
				eggHoppers.setTime("45 mins (+fermentation)");
				eggHoppers.setImage(
						"https://www.jetwinghotels.com/islandinsider/wp-content/uploads/2017/09/23A8399-1219x812.jpg");
				eggHoppers.setIngredients(List.of(
						"1 cup rice flour",
						"½ cup thick coconut milk",
						"¼ tsp instant yeast",
						"½ tsp sugar",
						"½ tsp salt",
						"1 egg per hopper",
						"Oil for greasing"));
				eggHoppers.setMethod(
						"1. Combine rice flour, coconut milk, yeast, sugar & salt. Whisk to a smooth batter. Let it ferment 3–4 hours at warm room temperature. "
								+
								"2. Heat a small nonstick bowl/skillet, lightly grease. Pour a ladleful of batter and swirl to coat sides—form a bowl. "
								+
								"3. Crack one egg into center, cover & cook until edges are crisp and egg is set. " +
								"4. Gently lift and serve hot with sambal or curry.");

				Recipe fishAmbulThiyal = new Recipe();
				fishAmbulThiyal.setName("Fish Ambul Thiyal");
				fishAmbulThiyal.setTime("60 mins");
				fishAmbulThiyal.setImage(
						"https://theperfectcurry.com/wp-content/uploads/2022/10/PXL_20221004_141950841.PORTRAIT.jpg");
				fishAmbulThiyal.setIngredients(List.of(
						"500 g firm fish (tuna/swordfish), cubed",
						"2 tbsp goraka (or 1 tbsp tamarind paste)",
						"1 tsp turmeric powder",
						"1 tbsp chili powder",
						"1 tsp black pepper powder",
						"1 tsp fenugreek seeds (optional)",
						"4–5 curry leaves",
						"2 cloves garlic, crushed",
						"Salt to taste",
						"2 tbsp oil",
						"1 cup water"));
				fishAmbulThiyal.setMethod(
						"1. In a bowl, marinate fish with goraka, turmeric, chili powder, pepper, garlic & salt. Let sit 30 min. "
								+
								"2. Heat oil in a casserole. Add fenugreek & curry leaves, sauté briefly. " +
								"3. Add marinated fish and 1 cup water. Bring to gentle boil, then reduce heat. " +
								"4. Simmer uncovered for 35–40 min, stirring occasionally, until gravy is almost dry and fish is coated in spices. "
								+
								"5. Serve with rice or string hoppers.");

				Recipe coconutRoti = new Recipe();
				coconutRoti.setName("Coconut Roti");
				coconutRoti.setTime("20 mins");
				coconutRoti.setImage("https://timesharesrilanka.com/wp-content/uploads/2022/02/roti-sri-lanka-lr.jpg");
				coconutRoti.setIngredients(List.of(
						"2 cups all-purpose flour",
						"1 cup freshly grated coconut",
						"½ tsp salt",
						"1 green chili, finely chopped (optional)",
						"Warm water (as needed)",
						"Oil or ghee for cooking"));
				coconutRoti.setMethod(
						"1. Mix flour, coconut, salt & chili in a bowl. Add warm water little by little, knead into a soft dough. "
								+
								"2. Divide into balls. Roll each out into a circle on a lightly floured surface. " +
								"3. Heat skillet, cook each roti 1–2 min per side, brushing lightly with oil/ghee until golden spots appear. "
								+
								"4. Serve hot with curry or sambal.");

				Recipe watalappan = new Recipe();
				watalappan.setName("Watalappan");
				watalappan.setTime("50 mins (+chill time)");
				watalappan.setImage("https://recipe30.com/wp-content/uploads/2018/10/Watalappam.jpg");
				watalappan.setIngredients(List.of(
						"1 cup jaggery (or brown sugar), grated",
						"1 cup thick coconut milk",
						"3 eggs",
						"¼ tsp ground cardamom",
						"Pinch of nutmeg",
						"1 tsp vanilla extract"));
				watalappan.setMethod(
						"1. In a saucepan, gently melt jaggery with 2 tbsp water until syrupy. Strain to remove impurities. "
								+
								"2. Whisk eggs in a bowl. Add jaggery syrup, coconut milk, cardamom, nutmeg & vanilla—mix until smooth. "
								+
								"3. Pour into a baking dish. Place dish in larger pan, pour hot water around (water bath). "
								+
								"4. Bake at 180°C (350°F) for 30–35 min until set but still quivery. " +
								"5. Chill 2 hours. Slice and serve garnished with crushed nuts.");

				sriLankan.setRecipes(List.of(dhal, koththu, eggHoppers, fishAmbulThiyal, coconutRoti, watalappan));

				cuisineRepo.save(sriLankan);

			}

			if (!cuisineRepo.existsByName("Thai ZestRush")) {
				// ------------------ Thai ------------------
				Cuisine thai = new Cuisine();
				thai.setName("Thai ZestRush");
				thai.setLevel("beginner");
				thai.setDescription(
						"An electrifying balance of sweet, sour, salty, and spicy - like a flavorful rollercoaster ride through fragrant herbs, silky curries, and wok-tossed perfection.");
				thai.setImage(
						"https://static-content.owner.com/funnel/images/b893f8fa-e87a-446b-aff7-f38ad82c832f?v=1326925160.jpg");

				Recipe padThai = new Recipe();
				padThai.setName("Pad Thai");
				padThai.setTime("30 mins");
				padThai.setImage(
						"https://images.squarespace-cdn.com/content/v1/60982df9899ff80ac258be5e/1652310608582-O0C9K9CJL206KQ94QTDO/IMG_0381.jpg");
				padThai.setIngredients(List.of("Rice noodles", "Shrimp or tofu", "Tamarind paste"));
				padThai.setMethod("1. Soak noodles. 2. Stir-fry with sauces and toppings.");

				Recipe greenCurry = new Recipe();
				greenCurry.setName("Green Curry");
				greenCurry.setTime("35 mins");
				greenCurry.setImage(
						"https://www.kitchensanctuary.com/wp-content/uploads/2019/06/Thai-Green-Curry-square-FS.jpg");
				greenCurry.setIngredients(List.of(
						"2 tbsp green curry paste",
						"400 ml coconut milk",
						"200 g chicken or tofu, sliced",
						"1 cup Thai eggplant, quartered",
						"4–5 kaffir lime leaves",
						"1 tbsp fish sauce",
						"1 tbsp palm sugar (or brown sugar)",
						"Handful Thai basil leaves",
						"2 tbsp oil"));
				greenCurry.setMethod("1. Heat oil in saucepan. Fry curry paste until aromatic. " +
						"2. Add half coconut milk, simmer until oil separates. " +
						"3. Add chicken/tofu, cook 3–4 min. Pour in remaining coconut milk. " +
						"4. Add eggplant, lime leaves, fish sauce & sugar. Simmer until eggplant is tender. " +
						"5. Stir in Thai basil, remove from heat, and serve with jasmine rice.");

				Recipe tomYum = new Recipe();
				tomYum.setName("Tom Yum Soup");
				tomYum.setTime("25 mins");
				tomYum.setImage("https://www.seriouseats.com/thmb/YoZ8Am6ADr29RZKZH8e9FzU_o78=/1500x0/...jpg");
				tomYum.setIngredients(List.of("Lemongrass", "Galangal", "Shrimp"));
				tomYum.setMethod("1. Boil broth. 2. Add herbs, mushrooms, and seafood.");

				Recipe thaiFriedRice = new Recipe();
				thaiFriedRice.setName("Thai Fried Rice");
				thaiFriedRice.setTime("20 mins");
				thaiFriedRice.setImage("https://www.chewoutloud.com/wp-content/uploads/2017/08/Thai-Fried-Rice-0.jpg");
				thaiFriedRice.setIngredients(List.of(
						"2 cups cooked jasmine rice (day-old)",
						"1 egg",
						"1 onion, chopped",
						"2 garlic cloves, minced",
						"2 tbsp fish sauce",
						"1 tbsp soy sauce",
						"½ cup mixed veggies (carrot, peas)",
						"2 tbsp oil",
						"Cucumber & tomato slices to serve"));
				thaiFriedRice.setMethod("1. Heat oil, sauté onion & garlic until soft. " +
						"2. Push aside, crack egg—scramble. " +
						"3. Add rice & veggies, stir-fry 2 min. " +
						"4. Season with fish sauce & soy sauce. Toss until well combined. " +
						"5. Serve with cucumber & tomato.");

				Recipe larbGai = new Recipe();
				larbGai.setName("Larb Gai");
				larbGai.setTime("25 mins");
				larbGai.setImage("https://www.everylastbite.com/wp-content/uploads/2020/04/DSC_0129-2-scaled.jpg");
				larbGai.setIngredients(List.of(
						"300g ground chicken",
						"1 tbsp uncooked sticky rice",
						"1 tbsp fish sauce",
						"1 tbsp lime juice",
						"1 tsp sugar",
						"2 small shallots, thinly sliced",
						"2 spring onions, chopped",
						"2 tbsp chopped mint leaves",
						"1 tbsp chopped cilantro",
						"1 tsp chili flakes (adjust to taste)"));
				larbGai.setMethod("1. Toast sticky rice in a dry pan until golden, then grind into coarse powder. " +
						"2. In a pan, cook ground chicken over medium heat without oil until fully cooked. " +
						"3. Remove from heat and mix in fish sauce, lime juice, sugar, chili flakes, and toasted rice powder. "
						+
						"4. Stir in shallots, spring onions, mint, and cilantro. " +
						"5. Serve warm or room temp with cabbage leaves or lettuce cups.");

				Recipe mangoStickyRice = new Recipe();
				mangoStickyRice.setName("Mango Sticky Rice");
				mangoStickyRice.setTime("35 mins");
				mangoStickyRice.setImage(
						"https://takestwoeggs.com/wp-content/uploads/2021/07/Thai-Mango-Sticky-Rice-Takestwoeggs-Process-Final-sq.jpg");
				mangoStickyRice.setIngredients(List.of(
						"1 cup glutinous (sticky) rice",
						"1 cup coconut milk",
						"½ cup sugar",
						"¼ tsp salt",
						"2 ripe mangoes, sliced",
						"Sesame seeds for garnish"));
				mangoStickyRice.setMethod("1. Rinse rice, soak 4 hours, steam until tender (20 min). " +
						"2. Heat coconut milk, sugar & salt—don’t boil. Remove from heat. " +
						"3. Pour half over hot rice, stir, let absorb 10 min. " +
						"4. Serve rice with mango slices, drizzle remaining coconut sauce, sprinkle sesame.");

				thai.setRecipes(List.of(padThai, greenCurry, tomYum, thaiFriedRice, larbGai, mangoStickyRice));

				cuisineRepo.save(thai);
			}

			if (!cuisineRepo.existsByName("Indian SpiceSaga")) {
				// ------------------ Indian ------------------
				Cuisine indian = new Cuisine();
				indian.setName("Indian SpiceSaga");
				indian.setLevel("beginner");
				indian.setDescription(
						"A sensory explosion of color, aroma, and flavor - from street food chaos to royal thalis, every bite is a bold celebration of spice, tradition, and soul-warming comfort.");
				indian.setImage(
						"https://chilliindia.com.au/wp-content/uploads/2024/01/Indian-cuisine-in-Melbourne.webp");

				Recipe masalaDosa = new Recipe();
				masalaDosa.setName("Masala Dosa");
				masalaDosa.setTime("50 mins (+ferment)");
				masalaDosa.setImage(
						"https://foodhub.scene7.com/is/image/woolworthsltdprod/1908-masala-dosa?wid=1300&hei=1300&fmt=png-alpha");
				masalaDosa.setIngredients(List.of(
						"2 cups rice",
						"½ cup urad dal",
						"Salt to taste",
						"2 potatoes, boiled & mashed",
						"1 onion, sliced",
						"1 tsp mustard seeds",
						"½ tsp turmeric powder",
						"2 tbsp oil",
						"Curry leaves & green chili in potato mix"));
				masalaDosa.setMethod(
						"1. Soak rice & dal separately 4–6 hrs. Grind with water to batter, ferment overnight. " +
								"2. For potato filling: heat oil, mustard seeds, onion, chili, curry leaves, turmeric; add potatoes, mix. "
								+
								"3. Heat dosa tawa, pour batter, swirl thin. Drizzle oil around edge. When edges lift, place filling, fold and serve with chutney.");

				Recipe poha = new Recipe();
				poha.setName("Poha");
				poha.setTime("20 mins");
				poha.setImage(
						"https://pipingpotcurry.com/wp-content/uploads/2020/12/Poha-Recipe-indori-Piping-Pot-Curry.jpg");
				poha.setIngredients(List.of(
						"2 cups flattened rice (poha)",
						"1 onion, chopped",
						"1 potato, diced",
						"1 green chili, chopped",
						"½ tsp mustard seeds",
						"10 curry leaves",
						"½ tsp turmeric powder",
						"Salt & sugar to taste",
						"2 tbsp oil",
						"Lemon & cilantro to garnish"));
				poha.setMethod("1. Rinse poha, drain well. " +
						"2. Heat oil, crackle mustard seeds & curry leaves. Add chili, onion, potato; sauté until potato is tender. "
						+
						"3. Add turmeric, salt, sugar; stir in poha. Cook 2 min. " +
						"4. Serve garnished with lemon juice & cilantro.");

				Recipe alooParatha = new Recipe();
				alooParatha.setName("Aloo Paratha");
				alooParatha.setTime("30 mins");
				alooParatha
						.setImage("https://sandhyahariharan.co.uk/wp-content/uploads/2009/10/aloo-methi-paratha-1.jpg");
				alooParatha.setIngredients(List.of(
						"2 cups whole wheat flour",
						"2 potatoes, boiled & mashed",
						"1 tsp chili powder",
						"1 tsp garam masala",
						"Salt to taste",
						"Oil/ghee for cooking",
						"Cilantro & green chili in filling"));
				alooParatha.setMethod("1. Knead flour + water + salt into soft dough. " +
						"2. Mix potatoes with spices. Divide dough into balls, flatten, place filling, seal, roll out gently. "
						+
						"3. Cook paratha on hot skillet with oil/ghee until golden on both sides. Serve hot with yogurt or pickle.");

				Recipe chanaChaat = new Recipe();
				chanaChaat.setName("Chana Chaat");
				chanaChaat.setTime("15 mins");
				chanaChaat.setImage(
						"https://www.indianveggiedelight.com/wp-content/uploads/2022/01/kala-chana-chaat-recipe-featured.jpg");
				chanaChaat.setIngredients(List.of(
						"2 cups boiled chickpeas",
						"1 onion, chopped",
						"1 tomato, chopped",
						"1 green chili, chopped",
						"1 tsp chaat masala",
						"1 tsp cumin powder",
						"Juice of 1 lemon",
						"Salt to taste",
						"Cilantro to garnish"));
				chanaChaat.setMethod("1. In a bowl, combine chickpeas, onion, tomato, chili. " +
						"2. Season with chaat masala, cumin, salt & lemon juice. Toss well. " +
						"3. Garnish with cilantro and serve immediately.");

				Recipe vegetableUpma = new Recipe();
				vegetableUpma.setName("Vegetable Upma");
				vegetableUpma.setTime("25 mins");
				vegetableUpma.setImage("https://cdn.cdnparenting.com/articles/2020/03/03172331/VEG-UPMA.webp");
				vegetableUpma.setIngredients(List.of(
						"1 cup semolina (rava)",
						"1 onion, chopped",
						"1 carrot, diced",
						"½ cup peas",
						"1 tsp mustard seeds",
						"10 curry leaves",
						"2 green chilies, chopped",
						"2 tbsp oil",
						"2 cups water",
						"Salt to taste"));
				vegetableUpma.setMethod("1. Dry roast semolina until light golden; set aside. " +
						"2. Heat oil, crackle mustard seeds & curry leaves. Sauté onion, chilies, carrot & peas. " +
						"3. Add water & salt; bring to boil. Lower heat, add semolina slowly, stirring to prevent lumps. "
						+
						"4. Cook 2–3 min until water absorbed. Serve hot.");

				Recipe paneerTikka = new Recipe();
				paneerTikka.setName("Paneer Tikka");
				paneerTikka.setTime("40 mins");
				paneerTikka
						.setImage("https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg");
				paneerTikka.setIngredients(List.of(
						"250 g paneer, cubed",
						"½ cup yogurt",
						"1 tbsp ginger-garlic paste",
						"1 tsp chili powder",
						"1 tsp garam masala",
						"½ tsp turmeric powder",
						"1 tbsp lemon juice",
						"Salt to taste",
						"Oil for grilling"));
				paneerTikka.setMethod("1. Whisk yogurt with spices, paste, lemon juice & salt. Marinate paneer 30 min. "
						+
						"2. Thread onto skewers, brush with oil. Grill or pan-fry each side until charred spots appear. "
						+
						"3. Serve hot with mint chutney.");

				indian.setRecipes(List.of(masalaDosa, poha, alooParatha, chanaChaat, vegetableUpma, paneerTikka));

				cuisineRepo.save(indian);
			}

			if (!cuisineRepo.existsByName("Mexican StreetSoul")) {
				// ------------------ Mexican ------------------
				Cuisine mexican = new Cuisine();
				mexican.setName("Mexican StreetSoul");
				mexican.setLevel("intermediate");
				mexican.setDescription(
						"A fiesta in every bite - smoky, zesty, and comforting. From fresh guac to sizzling enchiladas, it is the kind of food that hugs your taste buds and shouts ¡Viva la vida!");
				mexican.setImage(
						"https://mexiconewsdaily.com/wp-content/uploads/2024/08/Traditional-Mexican-Dishes-1.jpg");

				Recipe chickenEnchiladas = new Recipe();
				chickenEnchiladas.setName("Chicken Enchiladas");
				chickenEnchiladas.setTime("45 mins");
				chickenEnchiladas.setImage(
						"https://www.budgetbytes.com/wp-content/uploads/2025/02/Chicken-Enchiladas-Overhead.jpg");
				chickenEnchiladas.setIngredients(List.of(
						"8 corn tortillas",
						"2 cups shredded cooked chicken",
						"1 cup enchilada sauce",
						"1 cup shredded cheddar",
						"½ onion, diced",
						"1 tsp ground cumin",
						"1 tsp chili powder",
						"Salt & pepper to taste",
						"Oil for greasing"));
				chickenEnchiladas.setMethod("1. Preheat oven to 180°C (350°F). Lightly grease a baking dish. " +
						"2. In a bowl, mix chicken, half the cheese, onion, cumin, chili powder, salt & pepper. " +
						"3. Spoon a little enchilada sauce into each tortilla, fill with chicken mix, roll and place seam-side down in dish. "
						+
						"4. Pour remaining sauce over top, sprinkle with cheese. " +
						"5. Bake for 20-25 mins until cheese is melted and bubbly. Serve hot.");

				Recipe tacos = new Recipe();
				tacos.setName("Tacos");
				tacos.setTime("30 mins");
				tacos.setImage(
						"https://cookingformysoul.com/wp-content/uploads/2024/04/feat-carne-asada-tacos-min.jpg");
				tacos.setIngredients(List.of(
						"8 small taco shells",
						"500 g ground beef",
						"1 packet taco seasoning",
						"1 onion, chopped",
						"2 cloves garlic, minced",
						"Lettuce, tomato & cheese for topping",
						"Sour cream & salsa to serve"));
				tacos.setMethod("1. In a skillet, cook beef, onion & garlic until beef is browned. Drain fat. " +
						"2. Stir in taco seasoning with ¼ cup water; simmer for 5 mins. " +
						"3. Warm taco shells per package instructions. " +
						"4. Fill shells with beef mix, top with lettuce, tomato, cheese, sour cream & salsa. " +
						"5. Serve immediately.");

				Recipe guacamole = new Recipe();
				guacamole.setName("Guacamole");
				guacamole.setTime("15 mins");
				guacamole.setImage("https://feelgoodfoodie.net/wp-content/uploads/2024/05/Simple-Guacamole-07.jpg");
				guacamole.setIngredients(List.of(
						"3 ripe avocados",
						"1 small tomato, diced",
						"¼ red onion, finely chopped",
						"1 jalapeño, seeded & minced",
						"Juice of 1 lime",
						"2 tbsp cilantro, chopped",
						"Salt to taste"));
				guacamole.setMethod("1. Halve and pit avocados; scoop flesh into a bowl. " +
						"2. Mash lightly with fork, leaving some chunks. " +
						"3. Fold in tomato, onion, jalapeño, lime juice, cilantro & salt. " +
						"4. Taste and adjust seasoning. Serve with tortilla chips.");

				Recipe churros = new Recipe();
				churros.setName("Churros");
				churros.setTime("40 mins");
				churros.setImage(
						"https://www.sunglowkitchen.com/wp-content/uploads/2022/11/vegan-churros-recipe-11.jpg");
				churros.setIngredients(List.of(
						"1 cup water",
						"2 tbsp sugar",
						"2 tbsp oil",
						"1 cup flour",
						"Oil for frying",
						"½ cup sugar + 1 tsp cinnamon (for coating)"));
				churros.setMethod("1. In saucepan, bring water, sugar & oil to boil. " +
						"2. Remove from heat, stir in flour until smooth dough forms. " +
						"3. Heat oil in deep pan. Pipe strips of dough through a star nozzle into hot oil. " +
						"4. Fry until golden, drain on paper towels. " +
						"5. Roll in cinnamon-sugar mixture. Serve warm.");

				Recipe quesadilla = new Recipe();
				quesadilla.setName("Quesadilla");
				quesadilla.setTime("20 mins");
				quesadilla.setImage("https://cdn.loveandlemons.com/wp-content/uploads/2024/01/quesadilla-recipe.jpg");
				quesadilla.setIngredients(List.of(
						"4 large flour tortillas",
						"2 cups shredded cheese (cheddar or Monterey Jack)",
						"½ bell pepper, sliced",
						"½ onion, sliced",
						"2 tbsp oil",
						"Salsa & sour cream to serve"));
				quesadilla.setMethod("1. Heat 1 tbsp oil in skillet; sauté pepper & onion until tender. Remove. " +
						"2. Wipe pan, heat remaining oil. Place tortilla, sprinkle half the cheese, top with veggies and remaining cheese, cover with second tortilla. "
						+
						"3. Cook for 2-3 mins per side until golden and cheese melts. " +
						"4. Cut into wedges, serve with salsa & sour cream.");

				Recipe salsaVerde = new Recipe();
				salsaVerde.setName("Salsa Verde");
				salsaVerde.setTime("20 mins");
				salsaVerde.setImage("https://www.cookingclassy.com/wp-content/uploads/2019/10/salsa-verde-04.jpg");
				salsaVerde.setIngredients(List.of(
						"500 g tomatillos, husked & rinsed",
						"1 small onion, quartered",
						"2 jalapeños, stemmed",
						"2 garlic cloves",
						"½ cup cilantro leaves",
						"Salt to taste",
						"Juice of 1 lime"));
				salsaVerde.setMethod("1. Boil tomatillos, onion, jalapeños & garlic for 5-7 mins until soft. " +
						"2. Drain, transfer to blender; add cilantro & lime juice; blend until smooth. " +
						"3. Season with salt. Chill or serve immediately with chips.");

				mexican.setRecipes(List.of(chickenEnchiladas, tacos, guacamole, churros, quesadilla, salsaVerde));

				cuisineRepo.save(mexican);
			}

			if (!cuisineRepo.existsByName("Chinese WokWhirl")) {
				// ------------------ Chinese ------------------
				Cuisine chinese = new Cuisine();
				chinese.setName("Chinese WokWhirl");
				chinese.setLevel("intermediate");
				chinese.setDescription(
						"Bold flavors, wok magic, and nostalgic deliciousness - dumplings, sizzling stir-fries, and sweet-savory wonders that never miss the umami mark.");
				chinese.setImage(
						"https://images-cdn.welcomesoftware.com/Zz0zMDM2ZWM5NmQ5YjAxMWViODcwYmI5NWUzYmNlYzM0NA==/Zz01NTg2OGYyMmQ4MmYxMWViOGM4NjRkNDA4MzFmNzQ4OA%3D%3D.jpg");

				Recipe kungPaoChicken = new Recipe();
				kungPaoChicken.setName("Kung Pao Chicken");
				kungPaoChicken.setTime("30 mins");
				kungPaoChicken.setImage(
						"https://www.chilipeppermadness.com/wp-content/uploads/2021/03/Kung-Pao-Chicken-SQ.jpg");
				kungPaoChicken.setIngredients(List.of(
						"500 g chicken breast, diced",
						"2 tbsp soy sauce",
						"1 tbsp rice vinegar",
						"1 tsp cornstarch",
						"2 tbsp oil",
						"3 dried red chilies",
						"1 bell pepper, diced",
						"½ cup roasted peanuts",
						"2 cloves garlic, minced",
						"1 tsp ginger, minced",
						"1 tbsp sugar"));
				kungPaoChicken.setMethod("1. Marinate chicken with soy sauce, vinegar & cornstarch for 10 min. " +
						"2. Heat oil, fry chilies until dark (don’t burn). Remove. " +
						"3. Sauté garlic & ginger, add chicken; cook until white. " +
						"4. Add bell pepper, sugar & peanuts; toss. " +
						"5. Return chilies, stir-fry for 1 min. Serve hot with rice.");

				Recipe springRolls = new Recipe();
				springRolls.setName("Spring Rolls");
				springRolls.setTime("30 mins");
				springRolls.setImage(
						"https://redhousespice.com/wp-content/uploads/2021/12/whole-spring-rolls-and-halved-ones-scaled.jpg");
				springRolls.setIngredients(List.of(
						"12 spring roll wrappers",
						"200 g ground pork or shrimp",
						"1 cup shredded cabbage",
						"½ cup shredded carrot",
						"2 tbsp soy sauce",
						"1 tsp sesame oil",
						"2 garlic cloves, minced",
						"Oil for frying"));
				springRolls.setMethod(
						"1. Sauté garlic and meat until cooked. Add cabbage, carrot, soy sauce & sesame oil; cook for 2 min. "
								+
								"2. Cool filling. Place wrappers on damp cloth, add filling, roll, and seal edges with water. "
								+
								"3. Deep-fry in 180°C oil until golden. Drain. Serve with sweet chili sauce.");

				Recipe dumplings = new Recipe();
				dumplings.setName("Dumplings");
				dumplings.setTime("60 mins");
				dumplings.setImage(
						"https://images.squarespace-cdn.com/content/v1/55be995de4b071c106b3b4c0/6af0cbeb-8a58-4993-ab68-8e9919d6d04c/Salmon+Dumplings-6.jpg");
				dumplings.setIngredients(List.of(
						"30 dumpling wrappers",
						"300 g ground pork",
						"½ cup finely chopped napa cabbage",
						"2 tbsp soy sauce",
						"1 tbsp sesame oil",
						"2 garlic cloves, minced",
						"1 tsp ginger, minced"));
				dumplings.setMethod("1. Mix pork, cabbage, soy sauce, sesame oil, garlic & ginger. " +
						"2. Place teaspoon of filling in wrapper center; fold and seal edges. " +
						"3. Steam for 10 min or pan-fry bottom until crisp, then add water, cover & steam until done. "
						+
						"4. Serve with soy dipping sauce.");

				Recipe sweetAndSourPork = new Recipe();
				sweetAndSourPork.setName("Sweet and Sour Pork");
				sweetAndSourPork.setTime("45 mins");
				sweetAndSourPork.setImage(
						"https://pupswithchopsticks.com/wp-content/uploads/sweet-and-sour-pork-portrait4.jpg");
				sweetAndSourPork.setIngredients(List.of(
						"500 g pork loin, cubed",
						"½ cup pineapple chunks",
						"1 green bell pepper, sliced",
						"½ onion, sliced",
						"¼ cup ketchup",
						"2 tbsp vinegar",
						"2 tbsp sugar",
						"2 tbsp soy sauce",
						"1 tsp cornstarch",
						"Oil for frying"));
				sweetAndSourPork.setMethod("1. Toss pork in cornstarch; deep-fry until golden. Drain. " +
						"2. In wok, combine ketchup, vinegar, sugar & soy sauce; bring to simmer. " +
						"3. Add pork, pineapple, peppers & onion; toss until sauce thickens. " +
						"4. Serve with steamed rice.");

				Recipe mapoTofu = new Recipe();
				mapoTofu.setName("Mapo Tofu");
				mapoTofu.setTime("25 mins");
				mapoTofu.setImage(
						"https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2F2023-05-mapo-tofu%2Fmapo-tofu-017");
				mapoTofu.setIngredients(List.of(
						"400 g soft tofu, cubed",
						"100 g ground pork",
						"2 tbsp doubanjiang (chili-bean paste)",
						"1 tbsp soy sauce",
						"1 tsp sugar",
						"2 tbsp oil",
						"2 cloves garlic, minced",
						"1 tsp Sichuan peppercorns, toasted & ground",
						"2 spring onions, sliced"));
				mapoTofu.setMethod("1. Heat oil; fry peppercorns until fragrant, remove. " +
						"2. Sauté garlic & doubanjiang, add pork; cook until brown. " +
						"3. Add tofu, soy sauce, sugar & a splash of water; simmer for 5 min. " +
						"4. Garnish with spring onions. Serve with rice.");

				Recipe friedRice = new Recipe();
				friedRice.setName("Fried Rice");
				friedRice.setTime("20 mins");
				friedRice.setImage(
						"https://www.cookinwithmima.com/wp-content/uploads/2022/05/chinese-vegetarian-fried-rice.jpg");
				friedRice.setIngredients(List.of(
						"2 cups cold cooked rice",
						"1 egg, beaten",
						"½ cup mixed veggies (peas, carrots)",
						"2 tbsp soy sauce",
						"1 tbsp sesame oil",
						"2 tbsp oil",
						"2 spring onions, chopped"));
				friedRice.setMethod("1. Heat oil; scramble egg, remove. " +
						"2. Sauté veggies until tender. Add rice, soy sauce & sesame oil; stir-fry for 2 min. " +
						"3. Return egg, toss, garnish with spring onions. Serve hot.");

				chinese.setRecipes(
						List.of(kungPaoChicken, springRolls, dumplings, sweetAndSourPork, mapoTofu, friedRice));

				cuisineRepo.save(chinese);
			}

			if (!cuisineRepo.existsByName("French ButterMuse")) {
				// ------------------ French ------------------
				Cuisine french = new Cuisine();
				french.setName("French ButterMuse");
				french.setLevel("intermediate");
				french.setDescription(
						"Refined, romantic, and effortlessly chic - buttery pastries, rich sauces, and dishes so delicate they practically whisper bonjour as you take a bite.");
				french.setImage("https://ihmnotessite.com/wp-content/uploads/2020/04/FC1.jpg");

				Recipe quicheLorraine = new Recipe();
				quicheLorraine.setName("Quiche Lorraine");
				quicheLorraine.setTime("1 hr (incl. bake)");
				quicheLorraine.setImage("https://tasteofmissions.com/wp-content/uploads/2021/07/image.jpeg");
				quicheLorraine.setIngredients(List.of(
						"1 pie crust",
						"200 g bacon, diced",
						"3 eggs",
						"1 cup heavy cream",
						"1 cup grated Gruyère",
						"Salt, pepper & nutmeg"));
				quicheLorraine.setMethod("1. Preheat oven to 180°C (350°F). Blind-bake crust for 10 min. " +
						"2. Fry bacon until crisp; drain. " +
						"3. Whisk eggs, cream, cheese, salt, pepper & nutmeg. " +
						"4. Sprinkle bacon in crust, pour custard over. Bake for 30-35 min until set. " +
						"5. Cool slightly before slicing.");

				Recipe ratatouille = new Recipe();
				ratatouille.setName("Ratatouille");
				ratatouille.setTime("1 hr");
				ratatouille.setImage(
						"https://www.tablemagazine.com/wp-content/uploads/2023/03/AnnetteAtwoodratatouilleTABLEMagazineBryce.jpg");
				ratatouille.setIngredients(List.of(
						"1 eggplant, sliced",
						"1 zucchini, sliced",
						"1 bell pepper, sliced",
						"2 tomatoes, sliced",
						"1 onion, chopped",
						"2 cloves garlic, minced",
						"2 tbsp olive oil",
						"Herbes de Provence, salt & pepper"));
				ratatouille.setMethod("1. Preheat oven to 190°C (375°F). Sauté onion & garlic in oil until soft. " +
						"2. Layer veggies in baking dish, season each layer with herbs, salt & pepper. " +
						"3. Drizzle remaining oil, cover with foil. Bake for 40 min. Uncover for 10 min to brown. " +
						"4. Serve hot or at room temperature.");

				Recipe beefBourguignon = new Recipe();
				beefBourguignon.setName("Beef Bourguignon");
				beefBourguignon.setTime("3 hrs");
				beefBourguignon
						.setImage("https://poshjournal.com/wp-content/uploads/2023/11/beef-bourguignon-recipe-17.jpg");
				beefBourguignon.setIngredients(List.of(
						"1 kg beef chuck, cubed",
						"200 g bacon lardons",
						"2 carrots, sliced",
						"1 onion, chopped",
						"2 cloves garlic, minced",
						"2 tbsp flour",
						"2 cups red wine",
						"2 cups beef stock",
						"2 tbsp tomato paste",
						"Herbs (thyme, bay leaf)",
						"Oil, salt & pepper"));
				beefBourguignon.setMethod("1. Preheat oven to 160°C (325°F). Brown bacon; set aside. " +
						"2. Season beef, brown in bacon fat; remove. " +
						"3. Sauté carrots, onion & garlic. Stir in flour & tomato paste. " +
						"4. Return beef & bacon, pour wine & stock, add herbs. " +
						"5. Cover and braise in oven for 2½–3 hrs until tender. " +
						"6. Skim fat, adjust seasoning, and serve with potatoes.");

				Recipe crepes = new Recipe();
				crepes.setName("Crêpes");
				crepes.setTime("30 mins");
				crepes.setImage("https://www.nordicware.com/wp-content/uploads/2021/05/classic_crepes_1.jpg");
				crepes.setIngredients(List.of(
						"1 cup flour",
						"2 eggs",
						"1 cup milk",
						"2 tbsp melted butter",
						"Pinch of salt",
						"Butter for cooking"));
				crepes.setMethod("1. Whisk flour, eggs, milk, butter & salt to smooth batter; rest for 15 mins. " +
						"2. Heat nonstick pan, melt a little butter. " +
						"3. Pour small ladle, swirl to coat thinly. " +
						"4. Cook for 1 min each side until golden. Serve sweet or savory.");

				Recipe macarons = new Recipe();
				macarons.setName("Macarons");
				macarons.setTime("2 hrs (incl. rest)");
				macarons.setImage("https://bakewithshivesh.com/wp-content/uploads/2020/10/IMG-9033-scaled.jpg");
				macarons.setIngredients(List.of(
						"100 g almond flour",
						"100 g icing sugar",
						"2 egg whites",
						"25 g granulated sugar",
						"Food coloring (optional)",
						"Filling of choice"));
				macarons.setMethod("1. Sift almond flour & icing sugar. " +
						"2. Beat egg whites to soft peaks; gradually add sugar to stiff peaks. " +
						"3. Fold dry mix into whites until ribbon stage. Color if desired. " +
						"4. Pipe rounds on baking sheet; rest for 30 min until skin forms. " +
						"5. Bake at 150°C (300°F) for 12–14 min. Cool, sandwich with filling.");

				Recipe tarteTatin = new Recipe();
				tarteTatin.setName("Tarte Tatin");
				tarteTatin.setTime("1.5 hrs");
				tarteTatin.setImage(
						"https://images.squarespace-cdn.com/content/v1/5a51221e8a02c7e65800f1b7/1607438241733-2GUCBNPMWI792F3OK3HG/peartartetatin8.jpg");
				tarteTatin.setIngredients(List.of(
						"6 apples, peeled & halved",
						"½ cup sugar",
						"4 tbsp butter",
						"1 sheet puff pastry",
						"Pinch of salt"));
				tarteTatin.setMethod(
						"1. Preheat oven to 190°C (375°F). In ovenproof skillet, melt sugar until amber, add butter. " +
								"2. Arrange apple halves cut-side up, cook for 10 min on medium. " +
								"3. Cover apples with puff pastry, tuck edges. " +
								"4. Bake for 25–30 min until pastry is golden. Let cool for 5 min, invert onto plate. "
								+
								"5. Serve warm with cream or ice cream.");

				french.setRecipes(List.of(quicheLorraine, ratatouille, beefBourguignon, crepes, macarons, tarteTatin));

				cuisineRepo.save(french);
			}

			if (!cuisineRepo.existsByName("Japanese ZenBite")) {
				// ------------------ Japanese ------------------
				Cuisine japanese = new Cuisine();
				japanese.setName("Japanese ZenBite");
				japanese.setLevel("advanced");
				japanese.setDescription(
						"Where culinary art meets precision - minimalist, clean, and deeply soulful, every dish is a harmonious blend of flavor, culture, and centuries of craftsmanship.");
				japanese.setImage(
						"https://static.vecteezy.com/system/resources/thumbnails/049/000/669/small_2x/assorted-japanese-dishes-with-salmon-rice-and-vegetables-photo.jpg");

				Recipe sushi = new Recipe();
				sushi.setName("Sushi");
				sushi.setTime("60 mins");
				sushi.setImage("https://www.heinens.com/content/uploads/2023/06/Tuna-Sushi-Rolls-800x550-1.jpg");
				sushi.setIngredients(List.of(
						"2 cups sushi rice",
						"2 tbsp rice vinegar",
						"1 tbsp sugar",
						"Pinch salt",
						"Nori seaweed sheets",
						"200 g fresh sashimi-grade fish (tuna/salmon)",
						"Wasabi & pickled ginger"));
				sushi.setMethod("1. Rinse rice until water runs clear. Cook with 2¼ cups water in rice cooker. " +
						"2. Mix vinegar, sugar & salt; fold into hot rice, let cool. " +
						"3. Place nori on bamboo mat, spread rice thinly, top with fish slices. " +
						"4. Roll tightly, slice into pieces. Serve with wasabi & ginger.");

				Recipe ramen = new Recipe();
				ramen.setName("Ramen");
				ramen.setTime("120 mins");
				ramen.setImage("https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20180323163421/Ramen.jpg");
				ramen.setIngredients(List.of(
						"4 cups chicken or pork broth",
						"2 cups water",
						"2 tbsp miso paste",
						"1 tbsp soy sauce",
						"200 g fresh ramen noodles",
						"2 soft-boiled eggs",
						"Sliced pork belly",
						"Green onions & nori for garnish"));
				ramen.setMethod("1. Simmer broth, water, miso & soy for 20 min. " +
						"2. Boil noodles separately for 3 min; drain. " +
						"3. Divide noodles into bowls, ladle hot broth over. " +
						"4. Top with eggs, pork, onions & nori. Serve immediately.");

				Recipe tempura = new Recipe();
				tempura.setName("Tempura");
				tempura.setTime("40 mins");
				tempura.setImage("https://twosleevers.com/wp-content/uploads/2023/03/Shrimp-Tempura-1.png");
				tempura.setIngredients(List.of(
						"200 g shrimp & assorted veg (sweet potato, zucchini)",
						"1 cup tempura flour (or mix equal flour & cornstarch)",
						"1 cup ice-cold water",
						"Oil for deep-frying",
						"Tempura dipping sauce"));
				tempura.setMethod("1. Heat oil to 175°C (350°F). " +
						"2. Whisk flour & water lightly (batter should be lumpy). " +
						"3. Dip shrimp/veg in batter, deep-fry until pale golden. " +
						"4. Drain on rack, serve hot with dipping sauce.");

				Recipe tonkatsu = new Recipe();
				tonkatsu.setName("Tonkatsu");
				tonkatsu.setTime("50 mins");
				tonkatsu.setImage(
						"https://www.marionskitchen.com/wp-content/uploads/2021/08/20201110_Spicy-Pork-Tonkatsu-11-1200x1500.jpg");
				tonkatsu.setIngredients(List.of(
						"4 pork cutlets",
						"Salt & pepper",
						"½ cup flour",
						"1 egg, beaten",
						"1 cup panko breadcrumbs",
						"Oil for frying",
						"Tonkatsu sauce"));
				tonkatsu.setMethod("1. Season cutlets with salt & pepper. " +
						"2. Dredge in flour, dip in egg, coat in panko. " +
						"3. Fry in 170°C oil until golden (3–4 min per side). " +
						"4. Drain, slice & serve with cabbage & sauce.");

				Recipe mochi = new Recipe();
				mochi.setName("Mochi");
				mochi.setTime("90 mins");
				mochi.setImage("https://qeleg.com/cdn/shop/articles/20240411054015-peach-mochi.webp?v=1712814467");
				mochi.setIngredients(List.of(
						"1 cup glutinous rice flour",
						"¾ cup water",
						"¼ cup sugar",
						"Cornstarch for dusting",
						"Red bean paste (filling)"));
				mochi.setMethod(
						"1. Mix flour, water & sugar; microwave for 2 min, stir; microwave 1 min more until translucent. "
								+
								"2. Dust surface with cornstarch, flatten mochi dough, cut into squares. " +
								"3. Place filling in center, pinch edges to seal. Dust off excess starch. " +
								"4. Chill and serve.");

				Recipe okonomiyaki = new Recipe();
				okonomiyaki.setName("Okonomiyaki");
				okonomiyaki.setTime("50 mins");
				okonomiyaki.setImage(
						"https://www.heynutritionlady.com/wp-content/uploads/2013/06/Okonomiyaki-Japanese-Cabbage-Pancakes-1_SQ.jpg");
				okonomiyaki.setIngredients(List.of(
						"1 cup flour",
						"2/3 cup dashi or water",
						"1 egg",
						"2 cups shredded cabbage",
						"4 slices bacon",
						"Okonomiyaki sauce & mayo",
						"Bonito flakes & aonori"));
				okonomiyaki.setMethod("1. Mix flour, dashi & egg into batter. Fold in cabbage. " +
						"2. Heat skillet, lay bacon slices, pour batter over, shape into pancake. " +
						"3. Cook for 5 min per side until golden. " +
						"4. Drizzle sauce & mayo, top with bonito & aonori. Serve hot.");

				japanese.setRecipes(List.of(sushi, ramen, tempura, tonkatsu, mochi, okonomiyaki));

				cuisineRepo.save(japanese);
			}

			if (!cuisineRepo.existsByName("Spanish SizzleFlair")) {
				// ------------------ Spanish ------------------
				Cuisine spanish = new Cuisine();
				spanish.setName("Spanish SizzleFlair");
				spanish.setLevel("advanced");
				spanish.setDescription(
						"Passionate, bold, and bursting with zest - tapas, sizzling seafood, and saffron-kissed paella that’ll make your taste buds flamenco across the plate.");
				spanish.setImage(
						"https://t3.ftcdn.net/jpg/01/99/21/38/360_F_199213830_3nPpEuLyGq0bq7fCNPiqqr2IOddloO2h.jpg");

				Recipe paella = new Recipe();
				paella.setName("Paella");
				paella.setTime("60 mins");
				paella.setImage(
						"https://assets.epicurious.com/photos/63ef9f657c3e98834ec8645e/1:1/w_4225,h_4225,c_limit/Paella_RECIPE_021523_47427.jpg");
				paella.setIngredients(List.of(
						"2 cups bomba or short-grain rice",
						"4 cups chicken or seafood broth",
						"200 g mixed seafood (shrimp, mussels)",
						"1 chicken thigh, diced",
						"1 bell pepper, sliced",
						"½ cup peas",
						"1 onion, chopped",
						"2 cloves garlic",
						"1 tsp smoked paprika",
						"Pinch saffron",
						"Olive oil & salt"));
				paella.setMethod("1. Sauté chicken, onion, garlic & pepper in oil until golden. " +
						"2. Stir in rice, paprika & saffron. Add broth, bring to simmer. " +
						"3. Arrange seafood & peas on top; cook uncovered for 15–20 mins until rice is al dente. " +
						"4. Let rest for 5 mins. Serve straight from the pan.");

				Recipe tortillaEspanola = new Recipe();
				tortillaEspanola.setName("Tortilla Española");
				tortillaEspanola.setTime("40 mins");
				tortillaEspanola.setImage(
						"https://www.goya.com/wp-content/uploads/2023/10/tortilla-espanola-with-chorizo_pimientos-mushrooms.jpg");
				tortillaEspanola.setIngredients(List.of(
						"4 potatoes, thinly sliced",
						"1 onion, thinly sliced",
						"5 eggs",
						"Olive oil",
						"Salt to taste"));
				tortillaEspanola.setMethod("1. Fry potatoes & onion in oil gently until tender; drain. " +
						"2. Beat eggs, mix in potatoes & onion. " +
						"3. Pour back into skillet, cook on low heat until set on the bottom. " +
						"4. Invert onto plate, slide back to cook top briefly. " +
						"5. Slice and serve warm or at room temperature.");

				Recipe patatasBravas = new Recipe();
				patatasBravas.setName("Patatas Bravas");
				patatasBravas.setTime("35 mins");
				patatasBravas
						.setImage("https://mariefoodtips.com/wp-content/uploads/2022/07/patatas-bravas-scaled.jpg");
				patatasBravas.setIngredients(List.of(
						"4 medium potatoes, peeled and diced",
						"2 tbsp olive oil",
						"Salt to taste",
						"1 tsp smoked paprika",
						"½ cup mayonnaise",
						"1 tbsp tomato paste",
						"1 tsp red wine vinegar",
						"1 garlic clove, minced",
						"½ tsp cayenne pepper (optional)",
						"Chopped parsley (for garnish)"));
				patatasBravas.setMethod(
						"1. Boil diced potatoes in salted water for 5–7 minutes until just tender. Drain and let cool. "
								+
								"2. Toss potatoes with olive oil, salt, and smoked paprika. Bake at 220°C (425°F) for 25–30 minutes until crispy. "
								+
								"3. In a bowl, mix mayo, tomato paste, vinegar, garlic, and cayenne for the bravas sauce. "
								+
								"4. Drizzle sauce generously over hot potatoes and sprinkle with parsley. " +
								"5. Serve immediately while crispy and spicy 🔥.");

				Recipe gazpacho = new Recipe();
				gazpacho.setName("Gazpacho");
				gazpacho.setTime("20 mins");
				gazpacho.setImage("https://www.sandravalvassori.com/wp-content/uploads/2023/07/Img3090-scaled.jpg");
				gazpacho.setIngredients(List.of(
						"4 ripe tomatoes",
						"1 cucumber, peeled",
						"1 green pepper",
						"1 small onion",
						"2 cloves garlic",
						"3 tbsp olive oil",
						"2 tbsp sherry vinegar",
						"Salt & pepper"));
				gazpacho.setMethod("1. Blitz all ingredients in a blender until smooth. " +
						"2. Chill for 2 hrs. Serve cold with croutons or diced veggies.");

				Recipe flan = new Recipe();
				flan.setName("Flan");
				flan.setTime("1 hr (incl. chill)");
				flan.setImage("https://spanishsabores.com/wp-content/uploads/2025/01/Pumpkin-Flan-Featured-01.jpg");
				flan.setIngredients(List.of(
						"1 cup sugar",
						"4 eggs",
						"2 cups milk",
						"1 tsp vanilla"));
				flan.setMethod("1. Caramelize sugar in pan; pour into ramekins. " +
						"2. Whisk eggs, milk & vanilla; strain over caramel. " +
						"3. Bake in water bath at 160°C for 45 mins. " +
						"4. Chill, invert onto plate.");

				Recipe pisto = new Recipe();
				pisto.setName("Pisto");
				pisto.setTime("45 mins");
				pisto.setImage("https://radfoodie.com/wp-content/uploads/2022/11/Pisto-manchego-square1.jpg");
				pisto.setIngredients(List.of(
						"2 aubergines, diced",
						"2 zucchini, diced",
						"1 bell pepper, diced",
						"1 onion, chopped",
						"2 tomatoes, chopped",
						"Olive oil, salt & pepper"));
				pisto.setMethod("1. Sauté onion & pepper in oil until soft. " +
						"2. Add aubergine & zucchini, cook for 10 mins. " +
						"3. Stir in tomatoes, simmer for 20 mins until thick. " +
						"4. Season and serve with crusty bread.");

				spanish.setRecipes(List.of(paella, tortillaEspanola, patatasBravas, gazpacho, flan, pisto));

				cuisineRepo.save(spanish);
			}

			if (!cuisineRepo.existsByName("Italian PastaPassion")) {
				// ------------------ Italian ------------------
				Cuisine italian = new Cuisine();
				italian.setName("Italian PastaPassion");
				italian.setLevel("advanced");
				italian.setDescription(
						"A love letter to carbs and cheese - rustic, romantic, and absolutely irresistible. Whether it is handmade pasta or tiramisu, Italian food just gets you.");
				italian.setImage(
						"https://puertovallarta.hotelmousai.com/blog/assets/img/Top-10-Traditional-Foods-in-Italy.jpg");

				Recipe spaghettiAglioEOlio = new Recipe();
				spaghettiAglioEOlio.setName("Spaghetti Aglio e Olio");
				spaghettiAglioEOlio.setTime("20 mins");
				spaghettiAglioEOlio
						.setImage("https://www.the-pasta-project.com/wp-content/uploads/Spaghetti-aglio-e-olio-7.jpg");
				spaghettiAglioEOlio.setIngredients(List.of(
						"400 g spaghetti",
						"4 cloves garlic, sliced",
						"½ cup olive oil",
						"1 tsp red pepper flakes",
						"Parsley & parmesan to garnish",
						"Salt to taste"));
				spaghettiAglioEOlio.setMethod("1. Cook spaghetti in salted water al dente. " +
						"2. Sauté garlic & pepper flakes in oil until golden. " +
						"3. Toss pasta in garlic oil, season. " +
						"4. Plate, sprinkle parsley & cheese. Serve hot.");

				Recipe margheritaPizza = new Recipe();
				margheritaPizza.setName("Margherita Pizza");
				margheritaPizza.setTime("1 hr 30 mins");
				margheritaPizza.setImage(
						"https://tmbidigitalassetsazure.blob.core.windows.net/wpconnatixthumbnailsprod/MargheritaPizza275515H_thumbnail.jpeg");
				margheritaPizza.setIngredients(List.of(
						"Pizza dough",
						"½ cup tomato sauce",
						"200 g fresh mozzarella",
						"Basil leaves",
						"Olive oil & salt"));
				margheritaPizza.setMethod("1. Preheat oven to 250°C with pizza stone. " +
						"2. Stretch dough, spread sauce, top with mozzarella. " +
						"3. Bake 10–12 mins until crust is blistered. " +
						"4. Scatter basil, drizzle oil. Serve immediately.");

				Recipe bruschetta = new Recipe();
				bruschetta.setName("Bruschetta");
				bruschetta.setTime("15 mins");
				bruschetta.setImage(
						"https://jennifercooks.com/wp-content/uploads/2024/07/tomate-and-mozzarella-bruschetta-with-balsamic-drizzle-recipe-jennifercooks_0155-scaled.jpeg");
				bruschetta.setIngredients(List.of(
						"1 baguette, sliced",
						"2 tomatoes, diced",
						"2 cloves garlic, minced",
						"Basil & olive oil",
						"Salt & pepper"));
				bruschetta.setMethod("1. Toast bread slices. " +
						"2. Mix tomato, garlic, basil, oil, salt & pepper. " +
						"3. Spoon topping onto bread. Serve immediately.");

				Recipe pestoPasta = new Recipe();
				pestoPasta.setName("Pesto Pasta");
				pestoPasta.setTime("25 mins");
				pestoPasta.setImage("https://feelgoodfoodie.net/wp-content/uploads/2024/05/Shrimp-Pesto-Pasta-12.jpg");
				pestoPasta.setIngredients(List.of(
						"400 g pasta",
						"2 cups fresh basil leaves",
						"½ cup pine nuts",
						"2 cloves garlic",
						"½ cup parmesan",
						"½ cup olive oil",
						"Salt & pepper"));
				pestoPasta.setMethod("1. Blend basil, nuts, garlic, cheese & oil to pesto. " +
						"2. Cook pasta al dente, toss with pesto. " +
						"3. Plate & garnish with extra cheese.");

				Recipe tiramisu = new Recipe();
				tiramisu.setName("Tiramisu");
				tiramisu.setTime("4 hrs (+chill)");
				tiramisu.setImage(
						"https://i0.wp.com/www.foodfashionparty.com/wp-content/uploads/2023/05/iStock-1325617821-scaled.jpg?resize=1200%2C1200&ssl=1");
				tiramisu.setIngredients(List.of(
						"200 g ladyfingers",
						"3 eggs, separated",
						"½ cup sugar",
						"250 g mascarpone",
						"1 cup coffee, cooled",
						"Cocoa powder"));
				tiramisu.setMethod("1. Beat yolks & sugar until pale, fold in mascarpone. " +
						"2. Whip whites to soft peaks, gently fold into cream. " +
						"3. Dip ladyfingers in coffee, layer in tray, spread cream. " +
						"4. Repeat layers, dust cocoa. Chill for 3 hrs before serving.");

				Recipe capreseSalad = new Recipe();
				capreseSalad.setName("Caprese Salad");
				capreseSalad.setTime("10 mins");
				capreseSalad.setImage(
						"https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-2-2.jpg");
				capreseSalad.setIngredients(List.of(
						"2 large tomatoes, sliced",
						"200 g fresh mozzarella, sliced",
						"Fresh basil leaves",
						"Olive oil, balsamic glaze",
						"Salt & pepper"));
				capreseSalad.setMethod("1. Alternate tomato & mozzarella slices on plate. " +
						"2. Tuck basil leaves between. " +
						"3. Drizzle oil & glaze, season. Serve immediately.");

				italian.setRecipes(
						List.of(spaghettiAglioEOlio, margheritaPizza, bruschetta, pestoPasta, tiramisu, capreseSalad));

				cuisineRepo.save(italian);
			}


		};

	}
}
