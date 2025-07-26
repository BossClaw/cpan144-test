// FORM FOR THE API QUERY
import { useState } from "react";

export default function FormQuery({ onSearch, loading }) {
	// BASE FORM OPTIONS
	const [formData, setFormData] = useState({
		query: "",
		cuisine: "",
		includeIngredients: "",
		excludeIngredients: "",
		diet: "",
		intolerances: "",
		maxReadyTime: "",
		minCalories: "",
		maxCalories: "",
		sort: "popularity",
	});

	// CUISINE OPTIONS
	const cuisineOptions = [
		"African",
		"American",
		"British",
		"Cajun",
		"Caribbean",
		"Chinese",
		"Eastern European",
		"European",
		"French",
		"German",
		"Greek",
		"Indian",
		"Irish",
		"Italian",
		"Japanese",
		"Jewish",
		"Korean",
		"Latin American",
		"Mediterranean",
		"Mexican",
		"Middle Eastern",
		"Nordic",
		"Southern",
		"Spanish",
		"Thai",
		"Vietnamese",
	];

	const dietOptions = ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30"];

	const intoleranceOptions = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"];

	const sortOptions = [
		{ value: "popularity", label: "Popularity" },
		{ value: "healthiness", label: "Healthiness" },
		{ value: "price", label: "Price" },
		{ value: "time", label: "Cooking Time" },
		{ value: "random", label: "Random" },
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	
	const handleSubmit = (e) => {
		e.preventDefault();

		// BUILD SEARCH PARAMETERS
		const searchParams = {};

		// BASIC SEARCH QUERY
		if (formData.query.trim()) {
			searchParams.query = formData.query.trim();
		}

		// CUISINE
		if (formData.cuisine) {
			searchParams.cuisine = formData.cuisine;
		}

		// INGREDIENTS
		if (formData.includeIngredients.trim()) {
			searchParams.includeIngredients = formData.includeIngredients.trim();
		}

		if (formData.excludeIngredients.trim()) {
			searchParams.excludeIngredients = formData.excludeIngredients.trim();
		}

		// DIET
		if (formData.diet) {
			searchParams.diet = formData.diet;
		}

		// INTOLERANCES
		if (formData.intolerances) {
			searchParams.intolerances = formData.intolerances;
		}

		// TIME AND CALORIES
		if (formData.maxReadyTime) {
			searchParams.maxReadyTime = formData.maxReadyTime;
		}

		if (formData.minCalories) {
			searchParams.minCalories = formData.minCalories;
		}

		if (formData.maxCalories) {
			searchParams.maxCalories = formData.maxCalories;
		}


		// SORT
		searchParams.sort = formData.sort;

		onSearch(searchParams);
	};

	const handleReset = () => {
		setFormData({
			query: "",
			cuisine: "",
			includeIngredients: "",
			excludeIngredients: "",
			diet: "",
			intolerances: "",
			maxReadyTime: "",
			minCalories: "",
			maxCalories: "",
			sort: "popularity",
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 dark:text-black"
		>
			<div className="text-center mb-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-2">Find Your Perfect Recipe</h2>
				<p className="text-gray-600 text-sm">Use the filters below to discover recipes that match your preferences</p>
			</div>

			{/* Main Search */}
			<div>
				<label
					htmlFor="query"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Search Recipes
				</label>
				<input
					type="text"
					id="query"
					name="query"
					value={formData.query}
					onChange={handleInputChange}
					placeholder="e.g., pasta, chicken, chocolate cake..."
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			{/* Two Column Layout for Filters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-4">
					{/* Cuisine */}
					<div>
						<label
							htmlFor="cuisine"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Cuisine Type
						</label>
						<select
							id="cuisine"
							name="cuisine"
							value={formData.cuisine}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Any Cuisine</option>
							{cuisineOptions.map((cuisine) => (
								<option
									key={cuisine}
									value={cuisine}
								>
									{cuisine}
								</option>
							))}
						</select>
					</div>

					{/* Include Ingredients */}
					<div>
						<label
							htmlFor="includeIngredients"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Include Ingredients
						</label>
						<input
							type="text"
							id="includeIngredients"
							name="includeIngredients"
							value={formData.includeIngredients}
							onChange={handleInputChange}
							placeholder="e.g., tomatoes, cheese, basil"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">Separate multiple ingredients with commas</p>
					</div>

					{/* Exclude Ingredients */}
					<div>
						<label
							htmlFor="excludeIngredients"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Exclude Ingredients
						</label>
						<input
							type="text"
							id="excludeIngredients"
							name="excludeIngredients"
							value={formData.excludeIngredients}
							onChange={handleInputChange}
							placeholder="e.g., nuts, shellfish"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-4">
					{/* Diet */}
					<div>
						<label
							htmlFor="diet"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Diet Type
						</label>
						<select
							id="diet"
							name="diet"
							value={formData.diet}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Any Diet</option>
							{dietOptions.map((diet) => (
								<option
									key={diet}
									value={diet}
								>
									{diet}
								</option>
							))}
						</select>
					</div>

					{/* Intolerances */}
					<div>
						<label
							htmlFor="intolerances"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Food Intolerances
						</label>
						<select
							id="intolerances"
							name="intolerances"
							value={formData.intolerances}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">No Restrictions</option>
							{intoleranceOptions.map((intolerance) => (
								<option
									key={intolerance}
									value={intolerance}
								>
									{intolerance}
								</option>
							))}
						</select>
					</div>

					{/* Max Ready Time */}
					<div>
						<label
							htmlFor="maxReadyTime"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Max Cooking Time (minutes)
						</label>
						<input
							type="number"
							id="maxReadyTime"
							name="maxReadyTime"
							value={formData.maxReadyTime}
							onChange={handleInputChange}
							placeholder="e.g., 30"
							min="1"
							max="300"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			</div>


			{/* Calories Range */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="minCalories"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Min Calories
					</label>
					<input
						type="number"
						id="minCalories"
						name="minCalories"
						value={formData.minCalories}
						onChange={handleInputChange}
						placeholder="e.g., 200"
						min="0"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label
						htmlFor="maxCalories"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Max Calories
					</label>
					<input
						type="number"
						id="maxCalories"
						name="maxCalories"
						value={formData.maxCalories}
						onChange={handleInputChange}
						placeholder="e.g., 800"
						min="0"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>

			{/* Sort Options */}
			<div>
				<label
					htmlFor="sort"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Sort Results By
				</label>
				<select
					id="sort"
					name="sort"
					value={formData.sort}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					{sortOptions.map((option) => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-4 pt-4">
				<button
					type="submit"
					disabled={loading}
					className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
				>
					{loading ?  
					<div className="status flex items-center justify-center">
						<span className="mx-2">Loading</span>
						<svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
					</div>
					: "Search Recipes"}
				</button>
				<button
					type="button"
					onClick={handleReset}
					className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
				>
					Reset
				</button>
			</div>
		</form>
	);
}
