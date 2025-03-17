// src/components/CardSelector.jsx
import { useState, useRef, useEffect } from 'react';
import { imageCategories } from '../data';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

const CardSelector = () => {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [namePosition, setNamePosition] = useState({ x: 200, y: 356 });
  const [font, setFont] = useState('Cairo');
  const [fontStyle, setFontStyle] = useState('normal');
  const [activeTab, setActiveTab] = useState('RHC');
  const [highRes, setHighRes] = useState(false);
  const [fontSize, setFontSize] = useState(40);
  const canvasRef = useRef(null);
  const tabRefs = useRef([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: '0px' });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getUnderlinePosition = () => {
    const index = Object.keys(imageCategories).indexOf(activeTab);
    const tab = tabRefs.current[index];
    if (tab) {
      const tabWidth = tab.offsetWidth;
      const tabLeft = tab.offsetLeft;
      const isRTL = i18n.dir() === 'rtl';
      const container = tab.parentElement;
      const containerWidth = container.offsetWidth;

      if (isRTL) {
        const rightEdge = containerWidth - (tabLeft + tabWidth);
        const underlineRight = rightEdge + (tabWidth - 60) / 2;
        return { right: `${underlineRight}px`, left: 'auto' };
      } else {
        const underlineLeft = tabLeft + (tabWidth - 60) / 2;
        return { left: `${underlineLeft}px`, right: 'auto' };
      }
    }
    return { left: '0px', right: 'auto' };
  };

  useEffect(() => {
    const updatePosition = () => {
      setUnderlineStyle(getUnderlinePosition());
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    tabRefs.current.forEach((tab) => {
      if (tab) resizeObserver.observe(tab);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeTab, i18n.language]);

  const selectCard = (imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      setSelectedImage(img);
      setNamePosition({
        x: img.width / 2,
        y: img.height / 2,
      });
    };
  };

  const drawPreview = () => {
    if (!selectedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const originalWidth = selectedImage.width;
    const originalHeight = selectedImage.height;
    const dpi = highRes ? 200 : 72; // High-res: 200 DPI, Normal: 72 DPI
    const scale = dpi / 72;

    // Use original dimensions for canvas
    canvas.width = originalWidth;
    canvas.height = originalHeight;

    // Adjust preview display size
    const previewWidth = Math.min(originalWidth, 600);
    const previewScale = previewWidth / originalWidth;
    canvas.style.width = `${previewWidth}px`;
    canvas.style.height = `${originalHeight * previewScale}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height);

    // Font size: 25% of smaller dimension, scaled for DPI
    const baseFontSize = Math.min(originalWidth, originalHeight) * 0.25;
    const adjustedFontSize = (fontSize || baseFontSize) * (highRes ? scale : 1);

    ctx.font = `${fontStyle === 'bold' ? 'bold ' : ''}${
      fontStyle === 'italic' ? 'italic ' : ''
    }${adjustedFontSize}px "${font}"`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(name || t('enter_name'), namePosition.x, namePosition.y);
  };

  const debouncedDrawPreview = debounce(drawPreview, 100);

  const handleCanvasClick = (e) => {
    if (!selectedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const previewWidth = parseFloat(canvas.style.width);
    const previewHeight = parseFloat(canvas.style.height);
    const scaleX = selectedImage.width / previewWidth;
    const scaleY = selectedImage.height / previewHeight;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setNamePosition({ x, y });
    debouncedDrawPreview();
  };

  const downloadCard = () => {
    if (!selectedImage) {
      alert(t('select_card_alert'));
      return;
    }

    try {
      drawPreview();
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png', highRes ? 1.0 : 0.7); // High-res: 1.0, Normal: 0.7

      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error('Canvas failed to generate image data');
      }

      const link = document.createElement('a');
      link.download = `card_${highRes ? 'high_res' : 'normal'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert(
        t('high_res_error') ||
          'Failed to save image. Try again or use normal resolution.'
      );
    }
  };

  useEffect(() => {
    if (!selectedImage) return;
    debouncedDrawPreview();
    return () => debouncedDrawPreview.cancel();
  }, [
    selectedImage,
    name,
    color,
    namePosition,
    font,
    fontStyle,
    highRes,
    fontSize,
    i18n.language,
  ]);

  const whatsappCards = imageCategories[activeTab]?.filter(
    (_, index) => index % 2 === 0
  );
  const linkedinCards = imageCategories[activeTab]?.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <div
      className="min-h-screen bg-gray-200 flex flex-col items-center py-4 sm:py-8 overflow-hidden"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <h1 className="text-xl sm:text-2xl font-bold text-[#243e87] mb-4 fade-in">
        {t('select_card')}
      </h1>

      <div className="flex flex-col lg:flex-row flex-1 w-full max-w-6xl px-4 sm:px-6 lg:px-0">
        <div className="w-full lg:w-1/2 p-4 overflow-y-auto flex flex-col items-center gap-4">
          {/* Tabs */}
          <div className="w-full max-w-md mx-auto py-1 px-1 flex items-center justify-between mb-6 bg-[#F6F8FA] text-black text-sm font-medium leading-5 rounded-lg relative overflow-x-auto">
            {Object.keys(imageCategories).map((category, index) => (
              <button
                key={category}
                ref={(el) => (tabRefs.current[index] = el)}
                className={`border-none transition-all duration-300 cursor-pointer text-[#4e4e4e] rounded-[6px] py-1 px-4 hover:bg-white hover:text-black hover:shadow-2xl whitespace-nowrap ${
                  activeTab === category
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'bg-transparent'
                }`}
                onClick={() => handleTabChange(category)}
              >
                {category}
              </button>
            ))}
            <span
              className="absolute bottom-0 h-1 bg-[#ee2e3a] transition-all duration-300"
              style={{
                width: '60px',
                ...underlineStyle,
              }}
            />
          </div>

          {/* Cards Section */}
          <div className="w-full flex flex-col gap-6 py-6">
            {/* WhatsApp Story Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#243e87] mb-4">
                {i18n.language === 'ar' ? 'قصة واتساب' : 'WhatsApp Story'}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {whatsappCards?.map((src, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer w-40 h-64 sm:w-48 sm:h-80"
                    onClick={() => selectCard(src)}
                  >
                    <img
                      src={src}
                      alt={`WhatsApp Card ${index + 1}`}
                      className="w-full h-full object-contain rounded-t-lg group-hover:opacity-90 transition-opacity duration-200"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn Post Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#243e87] mb-4">
                {i18n.language === 'ar' ? 'منشور لينكدإن' : 'LinkedIn Post'}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {linkedinCards?.map((src, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer w-40 h-64 sm:w-48 sm:h-80"
                    onClick={() => selectCard(src)}
                  >
                    <img
                      src={src}
                      alt={`LinkedIn Card ${index + 1}`}
                      className="w-full h-full object-contain rounded-t-lg group-hover:opacity-90 transition-opacity duration-200"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="w-full max-w-md flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enter_name')}
                className="p-2 w-full bg-white border border-gray-300 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#243e87] focus:border-transparent transition-all duration-200"
              />
              <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                {i18n.language === 'ar'
                  ? 'اضغط أو المس الصورة لتحديد مكان الاسم'
                  : 'Click or touch the image to set name position'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label
                htmlFor="colorPicker"
                className="text-[#243e87] font-medium"
              >
                {t('choose_color')}
              </label>
              <input
                type="color"
                id="colorPicker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 bg-transparent border-none cursor-pointer"
              />
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="p-1 w-full sm:w-24 bg-white border border-gray-300 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#243e87]"
              >
                <option value="Cairo">Cairo</option>
                <option value="Tajawal">Tajawal</option>
                <option value="Amiri">Amiri</option>
                <option value="Arial">Arial</option>
              </select>
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="p-1 w-full sm:w-24 bg-white border border-gray-300 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#243e87]"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
              </select>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="p-1 w-full sm:w-24 bg-white border border-gray-300 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#243e87]"
              >
                <option value="40">40px</option>
                <option value="60">60px</option>
                <option value="80">80px</option>
                <option value="100">100px</option>
                <option value="120">120px</option>
                <option value="150">150px</option>
                <option value="200">200px</option>
                <option value="250">250px</option>
                <option value="300">300px</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="highRes"
                checked={highRes}
                onChange={(e) => setHighRes(e.target.checked)}
                className="w-4 h-4 accent-[#ee2e3a]"
              />
              <label htmlFor="highRes" className="text-[#243e87] font-medium">
                {t('save_high_quality')}
              </label>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center gap-4">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[600px] h-auto border border-gray-300 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.15)] cursor-crosshair"
            onClick={handleCanvasClick}
          />
          <button
            onClick={downloadCard}
            className="cursor-pointer px-6 py-2 bg-[#ee2e3a] text-white font-semibold rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.15)] hover:bg-[#ee2e3a]/80 hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 bounce-slow"
          >
            {t('save_card')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSelector;
