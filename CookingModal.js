// components/CookingModal.js
import { useState, useEffect } from 'react';

export default function CookingModal({ recipe, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    
    // If instructions is a string, try to split it into steps
    if (typeof instructions === 'string') {
      return instructions
        .split(/\d+\.|\n/)
        .filter(step => step.trim().length > 0)
        .map(step => step.trim());
    }
    
    // If it's an array of instruction objects
    if (Array.isArray(instructions)) {
      return instructions.map(instruction => 
        instruction.step || instruction.text || instruction
      );
    }
    
    return [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {recipe.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {recipe.readyInMinutes && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(recipe.readyInMinutes)}
                  </span>
                )}
                {recipe.servings && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {recipe.servings} servings
                  </span>
                )}
                {recipe.healthScore && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {recipe.healthScore}% healthy
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {[
                { id: 'ingredients', label: 'Ingredients', icon: '📝' },
                { id: 'instructions', label: 'Instructions', icon: '👨‍🍳' },
                { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
                { id: 'summary', label: 'Summary', icon: 'ℹ️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ingredients ({recipe.extendedIngredients?.length || 0})
                  </h3>
                  <button
                    onClick={() => setCheckedIngredients({})}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Reset Checklist
                  </button>
                </div>
                
                {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                  <div className="space-y-3">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <div 
                        key={index}
                        className={`flex items-start p-3 rounded-lg border transition-colors ${
                          checkedIngredients[index] 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checkedIngredients[index] || false}
                          onChange={() => handleIngredientCheck(index)}
                          className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className={`font-medium ${
                            checkedIngredients[index] ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </div>
                          {ingredient.original && ingredient.original !== `${ingredient.amount} ${ingredient.unit} ${ingredient.name}` && (
                            <div className="text-sm text-gray-600 mt-1">
                              {ingredient.original}
                            </div>
                          )}
                        </div>
                        {ingredient.image && (
                          <img
                            src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                            alt={ingredient.name}
                            className="w-8 h-8 rounded ml-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No ingredients information available.</p>
                )}
              </div>
            )}

            {/* Instructions Tab */}
            {activeTab === 'instructions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cooking Instructions
                </h3>
                
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <div className="space-y-4">
                    {recipe.analyzedInstructions[0].steps.map((step, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">{step.step}</p>
                          {step.ingredients && step.ingredients.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {step.ingredients.map((ingredient, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {ingredient.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recipe.instructions ? (
                  <div className="space-y-4">
                    {formatInstructions(recipe.instructions).map((step, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                          {index + 1}
                        </div>
                        <p className="flex-1 text-gray-800 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No cooking instructions available.</p>
                )}
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Nutritional Information
                </h3>
                
                {recipe.nutrition && recipe.nutrition.nutrients ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipe.nutrition.nutrients.slice(0, 8).map((nutrient, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{nutrient.name}</span>
                          <span className="text-gray-600">
                            {nutrient.amount} {nutrient.unit}
                          </span>
                        </div>
                        {nutrient.percentOfDailyNeeds && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Daily Value</span>
                              <span>{nutrient.percentOfDailyNeeds.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(nutrient.percentOfDailyNeeds, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No nutritional information available.</p>
                )}
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recipe Summary
                </h3>
                
                {recipe.summary ? (
                  <div 
                    className="prose max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                ) : (
                  <p className="text-gray-500 italic">No summary available.</p>
                )}

                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.cuisines && recipe.cuisines.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cuisines</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.cuisines.map((cuisine, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dish Types</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.dishTypes.map((type, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {recipe.sourceUrl && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
                    >
                      View Original Recipe
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

