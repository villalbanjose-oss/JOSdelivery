
'use client';

interface MenuHeaderProps {
  cartItems: any[];
  onShowCart: () => void;
}

export default function MenuHeader({ cartItems, onShowCart }: MenuHeaderProps) {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center">
          <div className="flex items-center">
            <div className="w-16 h-16 mr-4">
              <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center" 
                   style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                <div className="text-center">
                  <i className="ri-fire-line text-lg text-gray-800 mb-1 block"></i>
                  <p className="text-xs text-gray-800 font-bold">JOS</p>
                </div>
              </div>
            </div>
            <div>
              <h1 className="font-['Pacifico'] text-4xl text-orange-600">JOS</h1>
              <p className="text-gray-600 text-lg">Sabor Auténtico</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
