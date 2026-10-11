import React, { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  ChefHat, 
  ShieldCheck,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealMenu, MealType, DishItem, IngredientSupplier } from '../../types';

interface DailyMenuEditorProps {
  onSaved?: () => void;
}

const FOOD_PHOTO_PRESETS = [
  {
    label: 'North Indian Thali',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    desc: 'Paneer, Dal Makhani, Rice, Roti, Salad',
  },
  {
    label: 'South Indian Dosa & Idli',
    url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    desc: 'Crispy Dosa, Idli, Sambar & Chutneys',
  },
  {
    label: 'Dal Tadka & Phulka Dinner',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    desc: 'Yellow Dal, Mix Veg, Phulka, Rice',
  },
  {
    label: 'Chole Bhature Feast',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    desc: 'Amritsari Chole, Fluffy Bhature, Pickles',
  },
  {
    label: 'Veg Biryani / Pulao',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    desc: 'Dum Biryani with Mirchi Salan & Raita',
  },
  {
    label: 'Puri Sabzi & Halwa (Festive Breakfast)',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    desc: 'Bedmi Puri, Aloo Jhol, Suji Halwa',
  },
];

export const DailyMenuEditor: React.FC<DailyMenuEditorProps> = ({ onSaved }) => {
  const { menus, updateMenu, currentInstitution, currentUser, showToast } = useApp();

  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  
  // Find current menu for chosen meal type
  const currentMenu = menus.find(m => m.mealType === selectedMealType) || menus[0];

  // Editable fields state
  const [title, setTitle] = useState(currentMenu.title);
  const [timing, setTiming] = useState(currentMenu.timing);
  const [cutoffTime, setCutoffTime] = useState(currentMenu.cutoffTime);
  const [photoUrl, setPhotoUrl] = useState(currentMenu.photoUrl || FOOD_PHOTO_PRESETS[0].url);
  const [dishes, setDishes] = useState<DishItem[]>(currentMenu.dishes);
  const [suppliers, setSuppliers] = useState<IngredientSupplier[]>(currentMenu.suppliers);

  // New dish input form
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<DishItem['category']>('main');
  const [newDishPopularity, setNewDishPopularity] = useState<number>(85);
  const [newDishIsSpecial, setNewDishIsSpecial] = useState<boolean>(false);

  // New supplier input form
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngBrand, setNewIngBrand] = useState('');
  const [newIngSupplier, setNewIngSupplier] = useState('');
  const [newIngCert, setNewIngCert] = useState('FSSAI Grade A');

  // Preview toggle
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Switch meal type & sync states
  const handleMealTypeChange = (type: MealType) => {
    setSelectedMealType(type);
    const target = menus.find(m => m.mealType === type) || menus[0];
    if (target) {
      setTitle(target.title);
      setTiming(target.timing);
      setCutoffTime(target.cutoffTime);
      setPhotoUrl(target.photoUrl || FOOD_PHOTO_PRESETS[0].url);
      setDishes(target.dishes);
      setSuppliers(target.suppliers);
    }
  };

  // Image file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setPhotoUrl(result);
        showToast('Meal photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Dish
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newDish: DishItem = {
      id: `dish-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory,
      popularityPercent: Number(newDishPopularity),
      isSpecial: newDishIsSpecial,
    };

    setDishes([...dishes, newDish]);
    setNewDishName('');
    setNewDishIsSpecial(false);
    showToast(`Added "${newDish.name}" to menu`);
  };

  const handleRemoveDish = (dishId: string) => {
    setDishes(dishes.filter(d => d.id !== dishId));
  };

  // Add Supplier
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim() || !newIngBrand.trim()) return;

    const newSup: IngredientSupplier = {
      ingredient: newIngName.trim(),
      brand: newIngBrand.trim(),
      supplier: newIngSupplier.trim() || 'Verified Campus Vendor',
      certifications: newIngCert.trim(),
    };

    setSuppliers([...suppliers, newSup]);
    setNewIngName('');
    setNewIngBrand('');
    setNewIngSupplier('');
    setShowAddSupplier(false);
    showToast(`Added "${newSup.ingredient}" transparency tag`);
  };

  const handleRemoveSupplier = (idx: number) => {
    setSuppliers(suppliers.filter((_, i) => i !== idx));
  };

  // Save Menu
  const handleSaveMenu = () => {
    const updated: MealMenu = {
      ...currentMenu,
      title,
      timing,
      cutoffTime,
      photoUrl,
      dishes,
      suppliers,
    };

    updateMenu(updated);
    showToast(`Updated today's ${selectedMealType.toUpperCase()} menu and food picture! Students can see it now.`);
    if (onSaved) onSaved();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] text-xs font-bold flex items-center">
              <ChefHat className="w-3.5 h-3.5 mr-1" />
              Mess Maharaj Daily Menu Editor
            </span>
            <span className="text-xs text-[#596A7A]">
              • {currentUser?.hostel || 'Rajputana Hostel'} Mess
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Publish Today's Meals & Food Photos for Students
          </h2>
          <p className="text-xs text-[#596A7A] mt-0.5">
            Students see this live on their phones to register meal intent, inspect dishes, and verify quality ingredients.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 bg-[#F8F9F5] hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-500" />
            <span>Student Preview</span>
          </button>

          <button
            onClick={handleSaveMenu}
            className="px-5 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Publish & Save Menu</span>
          </button>
        </div>
      </div>

      {/* Meal Selection Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((type) => {
          const isSelected = selectedMealType === type;
          return (
            <button
              key={type}
              onClick={() => handleMealTypeChange(type)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize flex items-center space-x-1.5 whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#114232] text-white border-[#114232] shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-[#F8F9F5] border-[#E2E8F0]'
              }`}
            >
              <span>{type}</span>
              {isSelected && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">Editing</span>}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Basic Details & Food Picture Editor */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Food Picture Card (Core User Request!) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-[#D96B43]" />
                <span>Actual Meal Picture (Displayed to Students)</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Live Photo
              </span>
            </div>

            {/* Current Photo Preview with Badge */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 group">
              <img
                src={photoUrl}
                alt="Meal preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FOOD_PHOTO_PRESETS[0].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                <div className="text-white">
                  <div className="text-xs font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Kitchen Snapshot</span>
                  </div>
                  <p className="text-[10px] text-white/80">
                    Uploaded for {selectedMealType.toUpperCase()} by Maharaj Ramesh
                  </p>
                </div>
              </div>
            </div>

            {/* Upload from Mobile / File or URL */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Upload Photo from Phone / Device
                </label>
                <label className="w-full py-2.5 px-3 border border-dashed border-gray-300 hover:border-[#114232] rounded-xl flex items-center justify-center space-x-2 cursor-pointer bg-[#FAFBF9] hover:bg-white text-xs font-bold text-gray-700 transition-colors">
                  <Upload className="w-4 h-4 text-[#114232]" />
                  <span>Choose Photo File (JPG, PNG, WebP)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Or Paste Photo Web URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              {/* Quick High-Quality Presets */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Or Pick a Ready Presets for Today's Dish:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FOOD_PHOTO_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(p.url);
                        showToast(`Selected preset: ${p.label}`);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 ${
                        photoUrl === p.url
                          ? 'bg-[#E3EFE9] border-[#114232] text-[#114232] font-bold'
                          : 'bg-[#F8F9F5] border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate text-[11px] font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Meal Timings & Cut-off Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
              Meal Schedule & Registration Cut-off
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Meal Title / Banner Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. North Indian Special Thali"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#114232]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Serving Timing
                </label>
                <input
                  type="text"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  placeholder="e.g. 12:00 PM - 02:15 PM"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Registration Cut-off
                </label>
                <input
                  type="text"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#D96B43]"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Manage Dishes & Ingredients */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dishes List & Add Dish */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Today's Dishes & Recipes ({dishes.length} items)
                </h3>
                <p className="text-[11px] text-[#596A7A]">
                  Dishes served during this meal. Students can see each item and its popularity rating.
                </p>
              </div>
            </div>

            {/* Current dishes list */}
            <div className="space-y-2">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3 rounded-xl border border-gray-200 bg-[#FAFBF9] flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-[#114232] flex items-center justify-center font-bold text-xs">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 flex items-center space-x-1.5">
                        <span>{dish.name}</span>
                        {dish.isSpecial && (
                          <span className="text-[9px] bg-[#D96B43] text-white px-1.5 py-0.2 rounded font-bold">
                            Special
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 capitalize">
                        {dish.category} • Student Popularity: <span className="font-bold text-[#114232]">{dish.popularityPercent}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveDish(dish.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Dish Form */}
            <form onSubmit={handleAddDish} className="pt-3 border-t border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-700 block">
                + Add Dish to This Meal
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Dish Name (e.g. Paneer Butter Masala)"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full px-2 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="main">Main Curry</option>
                    <option value="dal">Dal</option>
                    <option value="bread">Bread / Roti</option>
                    <option value="rice">Rice / Pulao</option>
                    <option value="side">Side / Sabzi</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newDishPopularity}
                    onChange={(e) => setNewDishPopularity(Number(e.target.value))}
                    placeholder="Pop %"
                    className="w-full px-2 py-2 border rounded-xl text-xs font-medium"
                    title="Popularity percentage"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialDish"
                  checked={newDishIsSpecial}
                  onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                  className="rounded text-[#114232]"
                />
                <label htmlFor="specialDish" className="text-xs text-gray-700 font-medium">
                  Mark as "Special Item" (e.g. Gulab Jamun, Dosa, Paneer)
                </label>
              </div>
            </form>

          </div>

          {/* Ingredient & Verified Supplier Transparency */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#114232]" />
                  <span>Ingredient & Brand Quality Traceability</span>
                </h3>
                <p className="text-[11px] text-[#596A7A]">
                  Shows students the brands and suppliers of raw materials (Rice, Cooking Oil, Paneer, Atta).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddSupplier(!showAddSupplier)}
                className="px-3 py-1 bg-[#E3EFE9] text-[#114232] text-xs font-bold rounded-lg hover:bg-[#d4e6db] transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suppliers.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-gray-200 bg-[#FAFBF9] flex items-start justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-gray-900">{s.ingredient}</div>
                    <div className="text-[11px] text-[#596A7A] mt-0.5">
                      Brand: <span className="font-bold text-gray-800">{s.brand}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Vendor: {s.supplier} ({s.certifications})
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSupplier(idx)}
                    className="p-1 text-gray-400 hover:text-rose-600 rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Supplier Form */}
            {showAddSupplier && (
              <form onSubmit={handleAddSupplier} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                <div className="text-xs font-bold text-gray-800">
                  Add Transparent Ingredient & Brand:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newIngName}
                    onChange={(e) => setNewIngName(e.target.value)}
                    placeholder="Ingredient (e.g. Cooking Oil)"
                    className="p-2 border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={newIngBrand}
                    onChange={(e) => setNewIngBrand(e.target.value)}
                    placeholder="Brand (e.g. Fortune Pure Mustard)"
                    className="p-2 border rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newIngSupplier}
                    onChange={(e) => setNewIngSupplier(e.target.value)}
                    placeholder="Supplier / Distributor Name"
                    className="p-2 border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newIngCert}
                    onChange={(e) => setNewIngCert(e.target.value)}
                    placeholder="Certification (e.g. AGMARK, FSSAI)"
                    className="p-2 border rounded-lg text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSupplier(false)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#114232] text-white text-xs font-bold rounded-lg"
                  >
                    Add Traceability Tag
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Student View Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center space-x-1.5">
                <Eye className="w-5 h-5 text-[#114232]" />
                <span>Student Phone Preview: {selectedMealType.toUpperCase()}</span>
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Student Card */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="relative aspect-video">
                <img
                  src={photoUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#114232] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  📷 Actual Meal Photo by Mess Staff
                </div>
              </div>
              <div className="p-4 bg-white space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#D96B43] uppercase">{selectedMealType}</span>
                  <span className="text-gray-500">{timing}</span>
                </div>
                <h4 className="font-bold text-base text-gray-900">{title}</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dishes.map(d => (
                    <span key={d.id} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-medium">
                      {d.name} {d.isSpecial ? '⭐' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-[#114232] text-white text-xs font-bold rounded-xl"
              >
                Looks Good!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
