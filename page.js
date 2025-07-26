"use client";

// QUERY API PAGE
import { useState, useEffect } from "react";
import { useFavorites } from "./contexts/FavoritesContext";
import FormQuery from "./components/FormQuery";
import RecipeList from "./components/RecipeList";

export default function QueryPage() {
	// INIT STATES FOR QUERYING
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [offset, setOffset] = useState(0);
	const [totalResults, setTotalResults] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [currentQuery, setCurrentQuery] = useState(null);

	// USE THE FAVORITES CONTEXT
	const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

	// HANDLE RECEPIES SEARCH
	const searchRecipes = async (queryParams, isLoadMore = false) => {
		// WIP - LOAD MORE BUTTON
		console.log("RUNNING SEARCH RECIPES");

		// UPDATE THE STATE VARS
		setLoading(true);
		setError(null);

		// BEGIN
		try {
			// GET THE KEY FROM THE ENV FILE
			// NOTE - LOCAL DEV HAS THEIR OWN FILE
			// NOTE - ONLY KEYS PREFIXED WITH NEXT_PUBLIC ARE AVAIL TO THE WEB/CLIENT SIDE
			const apiKey = process.env.NEXT_PUBLIC_API_KEY;
			console.log("ENV API_KEY[" + process.env.NEXT_PUBLIC_API_KEY + "]");
			console.log("USING APIKEY[" + apiKey + "]");

			// UPDATE THE SEARCHOFFSET
			const searchOffset = isLoadMore ? offset : 0;

			// MAKE THE URL BASE
			var url = "https://api.apilayer.com/spoonacular";

			// ADD THE ENDPOINT
			url += "/recipes/complexSearch?";

			// MAKE THE QUERY STRING
			var query_str = "";

			// ENFORCE MAX RETURN AND CURRENT OFFSET
			// NOTE - API DEFAULT IS SUPPOSED TO BE 10, BUT I DON'T TRUST IT
			const MAX_QUERY_NUMBER = 6;
			queryParams.number = MAX_QUERY_NUMBER;
			queryParams.offset = searchOffset;
			queryParams.addRecipeInformation = true;
			queryParams.instructionsRequired = true;
			queryParams.addRecipeNutrition = true;
			queryParams.fillIngredients = true;

			// ADD THE QUERY VALS TO THE URL
			console.log("QUERY PARAMS OBJ FROM THE FORM");
			console.log(queryParams);

			// MAKE SEARCH PARAMS OBJ
			const searchParams = new URLSearchParams({
				...queryParams,
			});

			// MAKE QUERY STRING
			var query_str = searchParams.toString();
			console.log("USING QUERY STRING[" + query_str + "]");

			// ADD QUERY TO URL
			url += query_str;
			console.log("USING URL[" + url + "]");

			// NOTE BEFORE THE FETCH
			var startTime = Date.now();
			console.log("[" + Date.now().toString() + "] FETCH STARTED");

			// V2DO - SPINNER?

			// AWAIT THE RESPONSE DIRECT, FRONTEND
			const response = await fetch(url, {
				headers: {
					apikey: apiKey,
				},
			});

			// DUMP THE HEADERS
			console.log(response.headers);

			// TIME
			var endTime = Date.now();
			var duration = endTime - startTime;
			console.log("[" + Date.now().toString() + "] FETCH FINISHED IN (" + duration + "ms)");

			// EVAL THE RESPONSE
			if (!response.ok) {
				console.log("REPONSE NOT OK!![" + response.status + "]");
				throw new Error("Failed to fetch recipes " + response.statusText);
			}

			// GET THE DATA
			const data = await response.json();

			// HANDLE IF QUERY WAS FROM LOADMORE
			// NOTE - CHANGE OF QUERY, RESETS
			if (isLoadMore) {
				setRecipes((prev) => [...prev, ...data.results]);
			} else {
				setRecipes(data.results);
				setOffset(0);
			}

			// UPDATE VALS
			setTotalResults(data.totalResults);

			// DUMP TOTAL TO CONSOLE
			console.log("TOTAL RESULTS[" + data.totalResults + "]");

			// UPDATE VIZ OF HAS MORE BUTTON
			setHasMore(data.results.length === MAX_QUERY_NUMBER && searchOffset + MAX_QUERY_NUMBER < data.totalResults);

			// UPDATE THE OFFSET STATE VAR VALUE
			setOffset(searchOffset + data.results.length);

			// UPDAT THE FORM QUERY PARAMS
			setCurrentQuery(queryParams);
		} catch (err) {
			setError(err.message);
			console.error("Error fetching recipes:", err);
		} finally {
			setLoading(false);
		}
	};

	// LOAD MORE RECIPES BUTTON AT BOTTOM OF RESULTS
	const loadMoreRecipes = () => {
		if (currentQuery && hasMore && !loading) {
			searchRecipes(currentQuery, true);
		}
	};

	// HANDLE THE FAVORITES TOGGLE LOGIC
	const handleToggleFavorite = (recipe) => {
		// DETERMIME IF RECIPE IS FAVORITE IF favorites context HAS ANY MATCHING ID
		const isFavorite = favorites.some((fav) => fav.id === recipe.id);

		// UPDATE RECIPE FAVORITE STATE & BUTTON VIZ
		if (isFavorite) {
			removeFromFavorites(recipe.id);
		} else {
			addToFavorites(recipe);
		}
	};

	// RETURN THE PAGE
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8 ">
				<header className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">Recipe Finder</h1>
					<p className="text-gray-600">Discover delicious recipes tailored to your preferences</p>
				</header>

				{/* Search Form */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<FormQuery
						onSearch={searchRecipes}
						loading={loading}
					/>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
						<strong>Error:</strong> {error}
					</div>
				)}

				{/* Results Summary */}
				{totalResults > 0 && (
					<div className="mb-6">
						<p className="text-gray-600">
							Found {totalResults} recipes. Showing {recipes.length} results.
						</p>
					</div>
				)}

				{/* Recipe List */}
				<RecipeList
					recipes={recipes}
					favorites={favorites}
					onToggleFavorite={handleToggleFavorite}
					showFavoriteButton={true}
				/>

				{/* Load More Button */}
				{hasMore && (
					<div className="text-center mt-8">
						<button
							onClick={loadMoreRecipes}
							disabled={loading}
							className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							{loading ? "Loading..." : "Load More Recipes"}
						</button>
					</div>
				)}

				{/* No Results */}
				{!loading && recipes.length === 0 && currentQuery && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">No recipes found. Try adjusting your search criteria.</p>
					</div>
				)}
			</div>
		</div>
	);
}
