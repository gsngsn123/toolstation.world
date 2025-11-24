// ===== WORD COUNTER =====
function initWordCounter() {
    const textarea = document.getElementById('wordCountText');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const charNoSpaceCount = document.getElementById('charNoSpaceCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const readingTime = document.getElementById('readingTime');

    if (!textarea) return;

    function updateCounts() {
        const text = textarea.value;
        
        // Words
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;
        
        // Characters
        charCount.textContent = text.length;
        charNoSpaceCount.textContent = text.replace(/\s/g, '').length;
        
        // Sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentenceCount.textContent = sentences.length;
        
        // Paragraphs
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        paragraphCount.textContent = paragraphs.length;
        
        // Reading time (average 200 words per minute)
        const minutes = Math.ceil(words.length / 200);
        readingTime.textContent = minutes;
    }

    textarea.addEventListener('input', updateCounts);
    updateCounts();
}

// ===== TEXT CASE CONVERTER =====
function initCaseConverter() {
    const textarea = document.getElementById('caseText');
    if (!textarea) return;

    window.convertCase = function(caseType) {
        const text = textarea.value;
        let result = text;

        switch(caseType) {
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'title':
                result = text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                break;
            case 'sentence':
                result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
                break;
            case 'capitalize':
                result = text.replace(/\b\w/g, char => char.toUpperCase());
                break;
            case 'alternate':
                result = text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
                break;
        }

        textarea.value = result;
    };

    window.copyText = function() {
        textarea.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    };

    window.clearText = function() {
        textarea.value = '';
    };
}

// ===== QR CODE GENERATOR =====
function initQRGenerator() {
    const input = document.getElementById('qrText');
    const generateBtn = document.getElementById('generateQR');
    const qrcodeDiv = document.getElementById('qrcode');
    
    if (!input || !generateBtn) return;

    generateBtn.addEventListener('click', function() {
        const text = input.value.trim();
        if (!text) {
            alert('Please enter text or URL to generate QR code');
            return;
        }

        qrcodeDiv.innerHTML = '';
        
        // Create QR code using a simple library-free approach
        // For production, you'd use a library like qrcode.js
        // Here's a simple implementation using Google Charts API as fallback
        const qrSize = 300;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}`;
        
        const img = document.createElement('img');
        img.src = qrUrl;
        img.alt = 'QR Code';
        img.style.maxWidth = '100%';
        qrcodeDiv.appendChild(img);

        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download QR Code';
        downloadBtn.className = 'btn mt-1';
        downloadBtn.onclick = function() {
            const link = document.createElement('a');
            link.href = qrUrl;
            link.download = 'qrcode.png';
            link.click();
        };
        qrcodeDiv.appendChild(downloadBtn);
    });
}

// ===== IMAGE COMPRESSOR =====
function initImageCompressor() {
    const fileInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const compressBtn = document.getElementById('compressBtn');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadCompressed');

    if (!fileInput) return;

    let compressedBlob = null;

    qualitySlider?.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    compressBtn?.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Show original
                originalPreview.src = e.target.result;
                originalSize.textContent = (file.size / 1024).toFixed(2) + ' KB';

                // Compress
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const quality = qualitySlider.value / 100;
                canvas.toBlob(function(blob) {
                    compressedBlob = blob;
                    const url = URL.createObjectURL(blob);
                    compressedPreview.src = url;
                    compressedSize.textContent = (blob.size / 1024).toFixed(2) + ' KB';
                    downloadBtn.classList.remove('hidden');
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    downloadBtn?.addEventListener('click', function() {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'compressed-image.jpg';
        link.click();
    });
}

// ===== JPG <-> PNG CONVERTER =====
function initImageConverter() {
    const fileInput = document.getElementById('converterInput');
    const formatSelect = document.getElementById('outputFormat');
    const convertBtn = document.getElementById('convertBtn');
    const previewImg = document.getElementById('previewImg');
    const downloadBtn = document.getElementById('downloadConverted');

    if (!fileInput) return;

    let convertedBlob = null;

    convertBtn?.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // For PNG, fill with white background
                if (formatSelect.value === 'png') {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);

                const mimeType = formatSelect.value === 'png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(function(blob) {
                    convertedBlob = blob;
                    const url = URL.createObjectURL(blob);
                    previewImg.src = url;
                    previewImg.parentElement.classList.remove('hidden');
                    downloadBtn.classList.remove('hidden');
                }, mimeType, 0.95);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    downloadBtn?.addEventListener('click', function() {
        if (!convertedBlob) return;
        const url = URL.createObjectURL(convertedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `converted-image.${formatSelect.value}`;
        link.click();
    });
}

// ===== IMAGE TO PDF =====
function initImageToPDF() {
    const fileInput = document.getElementById('pdfImageInput');
    const convertBtn = document.getElementById('convertToPDF');
    const previewImg = document.getElementById('pdfPreviewImg');

    if (!fileInput) return;

    convertBtn?.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                previewImg.src = e.target.result;
                previewImg.parentElement.classList.remove('hidden');

                // Create PDF using jsPDF library alternative - simple canvas approach
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // A4 size ratio
                const a4Width = 595;
                const a4Height = 842;
                const imgRatio = img.width / img.height;
                const a4Ratio = a4Width / a4Height;
                
                let canvasWidth, canvasHeight;
                if (imgRatio > a4Ratio) {
                    canvasWidth = a4Width;
                    canvasHeight = a4Width / imgRatio;
                } else {
                    canvasHeight = a4Height;
                    canvasWidth = a4Height * imgRatio;
                }
                
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

                // Convert to blob and download
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'image-to-pdf.png'; // Simplified - would need jsPDF for real PDF
                    link.textContent = 'Download PDF (as image)';
                    link.className = 'btn mt-1';
                    
                    const downloadDiv = document.getElementById('pdfDownload');
                    downloadDiv.innerHTML = '';
                    downloadDiv.appendChild(link);
                    downloadDiv.classList.remove('hidden');
                }, 'image/png');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ===== BMI CALCULATOR =====
function initBMICalculator() {
    const calculateBtn = document.getElementById('calculateBMI');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const unit = document.getElementById('unit').value;

        if (!weight || !height) {
            alert('Please enter both weight and height');
            return;
        }

        let bmi;
        if (unit === 'metric') {
            // height in cm, weight in kg
            bmi = weight / Math.pow(height / 100, 2);
        } else {
            // height in inches, weight in lbs
            bmi = (weight / Math.pow(height, 2)) * 703;
        }

        let category, color;
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
        } else if (bmi < 25) {
            category = 'Normal weight';
            color = '#10b981';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
        } else {
            category = 'Obese';
            color = '#ef4444';
        }

        const resultDiv = document.getElementById('bmiResult');
        resultDiv.innerHTML = `
            <h3>Your Results</h3>
            <div class="stat-item" style="margin-top: 1rem;">
                <div class="stat-value" style="color: ${color}">${bmi.toFixed(1)}</div>
                <div class="stat-label">BMI</div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                <p style="font-weight: 600; color: ${color}; font-size: 1.25rem;">${category}</p>
                <p style="margin-top: 0.5rem; color: var(--text-light);">
                    ${getBMIAdvice(category)}
                </p>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    });

    function getBMIAdvice(category) {
        const advice = {
            'Underweight': 'Consider consulting with a healthcare provider about healthy ways to gain weight.',
            'Normal weight': 'Great! Maintain your healthy weight through balanced diet and regular exercise.',
            'Overweight': 'Consider adopting healthier eating habits and increasing physical activity.',
            'Obese': 'Consult with a healthcare provider for a personalized weight management plan.'
        };
        return advice[category] || '';
    }
}

// ===== LOAN EMI CALCULATOR =====
function initEMICalculator() {
    const calculateBtn = document.getElementById('calculateEMI');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const tenure = parseFloat(document.getElementById('tenure').value);

        if (!principal || !rate || !tenure) {
            alert('Please enter all values');
            return;
        }

        // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;
        
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
        
        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;

        const resultDiv = document.getElementById('emiResult');
        resultDiv.innerHTML = `
            <h3>Your EMI Breakdown</h3>
            <div class="stats" style="margin-top: 1rem;">
                <div class="stat-item">
                    <div class="stat-value">$${emi.toFixed(2)}</div>
                    <div class="stat-label">Monthly EMI</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${principal.toFixed(2)}</div>
                    <div class="stat-label">Principal Amount</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${totalInterest.toFixed(2)}</div>
                    <div class="stat-label">Total Interest</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${totalAmount.toFixed(2)}</div>
                    <div class="stat-label">Total Amount</div>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    });
}

// ===== YOUTUBE THUMBNAIL FINDER =====
function initYouTubeThumbnail() {
    const input = document.getElementById('youtubeUrl');
    const findBtn = document.getElementById('findThumbnail');
    const resultDiv = document.getElementById('thumbnailResult');

    if (!findBtn) return;

    findBtn.addEventListener('click', function() {
        const url = input.value.trim();
        if (!url) {
            alert('Please enter a YouTube URL');
            return;
        }

        // Extract video ID
        let videoId = null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                videoId = match[1];
                break;
            }
        }

        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }

        const thumbnails = [
            { name: 'Max Resolution', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
            { name: 'Standard Definition', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
            { name: 'High Quality', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
            { name: 'Medium Quality', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
            { name: 'Default', url: `https://img.youtube.com/vi/${videoId}/default.jpg` }
        ];

        let html = '<h3>Available Thumbnails</h3>';
        thumbnails.forEach(thumb => {
            html += `
                <div style="margin-top: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">${thumb.name}</h4>
                    <img src="${thumb.url}" alt="${thumb.name}" style="max-width: 100%; border-radius: 8px; box-shadow: var(--card-shadow);">
                    <a href="${thumb.url}" download="youtube-thumbnail-${thumb.name.toLowerCase().replace(/\s/g, '-')}.jpg" class="btn" style="display: inline-block; margin-top: 0.5rem;">Download</a>
                </div>
            `;
        });

        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
    });
}

// ===== SEO AND PERFORMANCE OPTIMIZATIONS =====

// Lazy load images for better performance
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Track user interactions for analytics
function initAnalytics() {
    // Track tool usage
    document.addEventListener('click', function(e) {
        if (e.target.matches('.tool-card, .tool-card *')) {
            const toolCard = e.target.closest('.tool-card');
            if (toolCard) {
                const toolName = toolCard.querySelector('h3')?.textContent || 'Unknown Tool';
                // Send to analytics (replace with your analytics code)
                console.log('Tool clicked:', toolName);
            }
        }
    });
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn')) {
            const buttonText = e.target.textContent || 'Unknown Button';
            console.log('Button clicked:', buttonText);
        }
    });
}

// Optimize Core Web Vitals
function initCoreWebVitals() {
    // Preload critical resources
    const criticalResources = [
        '/assets/style.css',
        '/assets/main.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
    
    // Optimize layout shifts
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
        img.addEventListener('load', function() {
            if (!this.width || !this.height) {
                this.style.aspectRatio = `${this.naturalWidth} / ${this.naturalHeight}`;
            }
        });
    });
}

// Service Worker for offline functionality
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
}

// Initialize AdSense ads
function initAdSense() {
    // Initialize AdSense ads after page load
    if (typeof adsbygoogle !== 'undefined') {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(ad => {
            if (!ad.dataset.adsbygoogleStatus) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        });
    }
}

// Error tracking and reporting
function initErrorTracking() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Send to error tracking service
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // Send to error tracking service
    });
}

// Initialize appropriate function based on page
document.addEventListener('DOMContentLoaded', function() {
    // Tool initializations
    initWordCounter();
    initCaseConverter();
    initQRGenerator();
    initImageCompressor();
    initImageConverter();
    initImageToPDF();
    initBMICalculator();
    initEMICalculator();
    initYouTubeThumbnail();
    
    // SEO and performance optimizations
    initLazyLoading();
    initAnalytics();
    initCoreWebVitals();
    initErrorTracking();
    
    // Initialize AdSense after a short delay
    setTimeout(initAdSense, 1000);
});

// Initialize service worker
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceWorker);
} else {
    initServiceWorker();
}
