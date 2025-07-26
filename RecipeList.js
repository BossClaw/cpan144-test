// RECIPE LIST
import RecipeView from "./RecipeView";

export default function RecipeList({ recipes, favorites, onToggleFavorite, showFavoriteButton = true, showCookingModal = false }) {
	const isFavorite = (recipeId) => {
		return favorites.some((fav) => fav.id === recipeId);
	};

	if (!recipes || recipes.length === 0) {
		return null;
	}

	return (
		<div className="recipe-list">
			{/* Grid Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{recipes.map((recipe) => (
					<RecipeView
						key={recipe.id}
						recipe={recipe}
						isFavorite={isFavorite(recipe.id)}
						onToggleFavorite={onToggleFavorite}
						showFavoriteButton={showFavoriteButton}
						showCookingModal={showCookingModal}
					/>
				))}
			</div>

			{/* Recipe Count Summary */}
			<div className="mt-8 text-center text-gray-500 text-sm">{recipes.length === 1 ? "1 recipe displayed" : `${recipes.length} recipes displayed`}</div>
		</div>
	);
}
