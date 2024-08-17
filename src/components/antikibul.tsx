// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Brain, Shuffle, Send, Trophy } from 'lucide-react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const semuaPertanyaan = [
  {
    pertanyaan: "Seorang politisi mengatakan: 'Jangan percaya kritik dari lawan saya. Dia baru saja bercerai, jadi dia tidak tahu apa-apa tentang nilai keluarga.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Ad Hominem"
  },
  {
    pertanyaan: "Seorang aktivis berpendapat: 'Jika kita mengizinkan pernikahan sesama jenis, selanjutnya orang akan ingin menikahi hewan peliharaan mereka!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Slippery Slope"
  },
  {
    pertanyaan: "Sebuah iklan menyatakan: '9 dari 10 selebriti menggunakan produk ini, jadi pasti bagus untuk Anda!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Bandwagon"
  },
  {
    pertanyaan: "Dalam debat, seseorang berkata: 'Teori evolusi hanyalah teori, bukan fakta.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Equivocation"
  },
  {
    pertanyaan: "Seorang manajer berkata kepada karyawannya: 'Kamu harus lembur hari ini. Jika tidak, itu berarti kamu tidak peduli dengan pekerjaanmu.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "False Dilemma"
  },
  {
    pertanyaan: "Seorang ilmuwan menyatakan: 'Berdasarkan data dari 1000 sampel acak, kita dapat menyimpulkan bahwa 30% populasi memiliki karakteristik ini.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Dalam sebuah argumen, seseorang mengatakan: 'Kita harus mengurangi penggunaan plastik karena dampak negatifnya terhadap lingkungan sudah terbukti secara ilmiah.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Seorang ahli ekonomi berpendapat: 'Jika inflasi terus meningkat tanpa kenaikan upah yang sepadan, daya beli masyarakat akan menurun.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Seorang politisi berkata: 'Lawan saya tidak layak menjadi pemimpin karena dia belum menikah. Pemimpin harus bisa mengurus keluarga dulu.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Ad Hominem"
  },
  {
    pertanyaan: "Dalam debat, seseorang berargumen: 'Jika kita melegalkan ganja, selanjutnya semua jenis narkoba akan dilegalkan!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Slippery Slope"
  },
  {
    pertanyaan: "Iklan sebuah produk mengatakan: 'Semua orang keren menggunakan ini. Anda juga harus membelinya!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Bandwagon"
  },
  {
    pertanyaan: "Seseorang berpendapat: 'Teori relativitas hanyalah teori, jadi belum terbukti benar.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Equivocation"
  },
  {
    pertanyaan: "Orangtua berkata pada anaknya: 'Kalau kamu tidak belajar dengan giat, masa depanmu akan suram.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "False Dilemma"
  },
  {
    pertanyaan: "Sebuah studi menemukan korelasi positif yang signifikan antara tingkat pendidikan dan pendapatan. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang dokter menjelaskan: 'Merokok meningkatkan risiko kanker paru-paru karena zat karsinogenik dalam asap rokok merusak sel-sel paru-paru.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam diskusi, seseorang menyatakan: 'Kita perlu meningkatkan anggaran pendidikan karena investasi di bidang pendidikan penting untuk kemajuan bangsa.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Seorang pengamat berkata: 'Dia pasti bersalah. Lihat saja penampilannya yang mencurigakan!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Ad Hominem"
  },
  {
    pertanyaan: "Dalam kampanye, seorang kandidat berkata: 'Jika lawan saya terpilih, negara kita akan jatuh ke dalam kekacauan!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Slippery Slope"
  },
  {
    pertanyaan: "Iklan sebuah restoran mengatakan: 'Semua selebriti makan di sini, jadi makanannya pasti enak!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Bandwagon"
  },
  {
    pertanyaan: "Dalam debat, seseorang berkata: 'Hipotesis itu hanyalah hipotesis, belum terbukti.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Equivocation"
  },
  {
    pertanyaan: "Seorang bos berkata pada karyawannya: 'Kalau kamu tidak setuju dengan kebijakanku, silakan resign.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "False Dilemma"
  },
  {
    pertanyaan: "Sebuah penelitian menemukan bahwa orang yang tidur kurang dari 6 jam sehari memiliki risiko obesitas lebih tinggi. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang ahli lingkungan menjelaskan: 'Penggundulan hutan menyebabkan erosi tanah karena akar pohon tidak lagi menahan tanah.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah editorial, penulis berpendapat: 'Kita harus meningkatkan upaya untuk mengurangi polusi udara demi kesehatan masyarakat.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Seorang politisi berkata: 'Lawan saya pernah gagal dalam bisnis, jadi dia tidak bisa dipercaya untuk memimpin negara.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Ad Hominem"
  },
  {
    pertanyaan: "Dalam debat, seseorang berargumen: 'Jika kita mengizinkan pernikahan sesama jenis, selanjutnya poligami juga akan dilegalkan!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Slippery Slope"
  },
  {
    pertanyaan: "Iklan sebuah merek pakaian mengatakan: 'Semua orang yang stylish memakai merek ini. Anda juga harus membelinya!' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Bandwagon"
  },
  {
    pertanyaan: "Dalam diskusi, seseorang menyatakan: 'Teori itu hanyalah spekulasi, belum ada bukti konkretnya.' Apakah ini fallacy?",
    jawaban: true,
    bobot: 1,
    jenis: "Equivocation"
  },
  {
    pertanyaan: "Sebuah studi menemukan bahwa olahraga teratur menurunkan risiko penyakit jantung. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Seorang ahli ekonomi berpendapat: 'Menaikkan pajak untuk orang kaya dapat mengurangi kesenjangan ekonomi.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Penelitian menunjukkan adanya korelasi antara konsumsi buah dan sayur dengan penurunan risiko kanker. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang psikolog menjelaskan: 'Terapi kognitif dapat membantu mengatasi depresi dengan mengubah pola pikir negatif.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah debat, seseorang berargumen: 'Kita harus meningkatkan anggaran untuk pendidikan anak usia dini karena ini adalah investasi untuk masa depan.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Sebuah analisis data menunjukkan bahwa perusahaan dengan keberagaman gender yang lebih tinggi cenderung lebih inovatif. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang dokter menjelaskan: 'Vaksinasi dapat mencegah penyakit menular karena merangsang sistem kekebalan tubuh untuk membentuk antibodi.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah editorial, penulis berpendapat: 'Kita harus mempromosikan penggunaan energi terbarukan untuk mengurangi emisi karbon.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Sebuah studi menemukan korelasi antara konsumsi kafein yang tinggi dengan gangguan tidur. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang ahli botani menjelaskan: 'Tanaman membutuhkan sinar matahari untuk fotosintesis, yang menghasilkan energi untuk pertumbuhannya.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah diskusi, seseorang berargumen: 'Kita harus mendanai penelitian tentang penyakit langka karena setiap nyawa berharga.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Sebuah survei menunjukkan bahwa mayoritas orang lebih memilih produk ramah lingkungan. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang ahli geologi menjelaskan: 'Gempa bumi terjadi karena pergeseran lempeng tektonik di kerak Bumi.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah debat, seseorang berargumen: 'Kita harus memperkuat perlindungan data pribadi untuk melindungi privasi warga.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Sebuah analisis statistik menunjukkan bahwa tingkat pendidikan berkorelasi positif dengan pendapatan. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang ahli nutrisi menjelaskan: 'Mengonsumsi makanan tinggi serat dapat membantu pencernaan karena serat membantu pergerakan usus.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah diskusi, seseorang berargumen: 'Kita harus meningkatkan anggaran untuk konservasi alam karena keanekaragaman hayati penting bagi keseimbangan ekosistem.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  },
  {
    pertanyaan: "Sebuah studi menemukan bahwa orang yang secara teratur bermeditasi memiliki tingkat stres yang lebih rendah. Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Statistical Inference"
  },
  {
    pertanyaan: "Seorang ahli fisika menjelaskan: 'Benda jatuh karena gaya gravitasi menariknya ke pusat Bumi.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Causal Reasoning"
  },
  {
    pertanyaan: "Dalam sebuah editorial, penulis berpendapat: 'Kita harus mendukung program rehabilitasi narkoba karena ini membantu pecandu memulai hidup baru.' Apakah ini fallacy?",
    jawaban: false,
    bobot: 1,
    jenis: "Valid Argument"
  }
];




const AplikasiTerapiAntiKibul = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [pertanyaanFallacy, setPertanyaanFallacy] = useState([]);
  const [fallacyResults, setFallacyResults] = useState({});
  const [playerName, setPlayerName] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  const HighScoreList = () => {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Simulating API call with dummy data
      const fetchScores = async () => {
        setIsLoading(true);
        try {
          // Dummy data
          const dummyScores = [
            { name: "Budi", score: 95 },
            { name: "Ani", score: 90 },
            { name: "Citra", score: 85 },
            { name: "Dodi", score: 80 },
            { name: "Eka", score: 75 },
          ];
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setScores(dummyScores);
        } catch (err) {
          setError("Failed to fetch high scores");
        } finally {
          setIsLoading(false);
        }
      };

      fetchScores();
    }, []);

    if (isLoading) return <p>Memuat daftar skor tertinggi...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Peringkat</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="text-right">Skor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{score.name}</TableCell>
              <TableCell className="text-right">{score.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleSubmitDialogClose = (submitted = false) => {
    setIsSubmitDialogOpen(false);
    if (submitted) {
      setIsScoreSubmitted(true);
    }
  };

  const HighScoreSubmission = useMemo(() => {
    return ({ onSubmit, finalScore }) => {
      const [playerName, setPlayerName] = useState('');
      const [submissionStatus, setSubmissionStatus] = useState(null);
      const [isSubmitted, setIsSubmitted] = useState(false);

      const handleSubmit = useCallback(async () => {
        if (!playerName.trim()) {
          setSubmissionStatus('error');
          return;
        }

        try {
          const response = await onSubmit(playerName);
          if (response.ok) {
            setSubmissionStatus('success');
            setIsSubmitted(true);
          } else {
            setSubmissionStatus('error');
          }
        } catch (error) {
          console.error('Error submitting score:', error);
          setSubmissionStatus('error');
        }
      }, [playerName, onSubmit, isSubmitted]);

      if (isSubmitted) {
        return (
          <div className="mb-4">
            <Alert className="bg-green-100 border-green-400 text-green-700">
              <AlertDescription>Skor Kamu ({finalScore}) telah berhasil disubmit!</AlertDescription>
            </Alert>
          </div>
        );
      }

      return (
        <div className="w-full mb-4">
          <h3 className="text-xl font-bold mb-2 text-white text-center">🏆 Kirim Skor Kamu 🏆</h3>
          <Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="w-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Send className="mr-2 h-4 w-4" /> Kirim Skor
          </Button>
          {submissionStatus === 'error' && (
            <Alert className="mt-2 bg-red-100 border-red-400 text-red-700">
              <AlertDescription>Error submitting score. Please try again.</AlertDescription>
            </Alert>
          )}
        </div>
      );
    };
  }, []);


  const submitHighScore = useCallback(async (playerName) => {
    try {
      const response = await fetch('https://antikibul-be.seo.pawonmburi.com/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
        }),
      });
      setIsScoreSubmitted(true);
      return response;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }, [score]);

  const shuffleQuestions = () => {
    const shuffled = [...semuaPertanyaan].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const mulaiGame = () => {
    const questions = shuffleQuestions();
    setPertanyaanFallacy(questions);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setFallacyResults({});
    setIsScoreSubmitted(false); // Reset score submission status
  };

  const jawabPertanyaan = (jawaban) => {
    const currentQuestion = pertanyaanFallacy[currentQuestionIndex];
    const isCorrect = jawaban === currentQuestion.jawaban;

    if (isCorrect) {
      setScore(score + currentQuestion.bobot);
    } else {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }

    // Update fallacy results
    setFallacyResults(prev => {
      const newResults = { ...prev };
      if (!newResults[currentQuestion.jenis]) {
        newResults[currentQuestion.jenis] = { total: 0, correct: 0 };
      }
      newResults[currentQuestion.jenis].total++;
      if (isCorrect) {
        newResults[currentQuestion.jenis].correct++;
      }
      return newResults;
    });

    if (currentQuestionIndex < pertanyaanFallacy.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const getEvaluasi = () => {
    const totalBobot = pertanyaanFallacy.reduce((sum, q) => sum + q.bobot, 0);
    const persentase = (score / totalBobot) * 100;
    if (persentase >= 90) {
      return "Wah! Anda sudah kebal terhadap segala jenis kibul-kibulan! Otak Anda sekuat baja, tidak bisa ditipu daya!";
    } else if (persentase >= 70) {
      return "Lumayan juga! Anda sudah bisa menangkis sebagian besar rayuan gombal. Tapi hati-hati, masih ada celah untuk dikelabui!";
    } else if (persentase >= 50) {
      return "Aduh! Anda masih gampang termakan omongan manis. Perlu lebih banyak minum jamu anti-kibul nih!";
    } else {
      return "Waduh! Anda masih sangat rentan terhadap kibul-kibulan. Segera konsumsi ramuan anti-bego sebelum terlambat!";
    }
  };

  // const getFallacyChartData = () => {
  //   return Object.entries(fallacyResults)
  //     .map(([jenis, result]) => {
  //       const vulnerability = ((result.total - result.correct) / result.total) * 1;
  //       return vulnerability > 0 ? { name: jenis, vulnerability } : null;
  //     })
  //     .filter(Boolean);
  // };

  const getFallacyChartData = () => {
    const totalQuestions = pertanyaanFallacy.length;
    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - correctAnswers;

    return [
      { name: 'Jawaban Benar', value: correctAnswers },
      { name: 'Jawaban Salah', value: incorrectAnswers }
    ];
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-white text-center animate-pulse ">
        🧠💊 Terapi Anti Kibul 🧠💊
      </h1>
      <Card className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ${shakeWrong ? 'animate-shake' : ''}`}>
        <CardContent className="p-6 bg-white bg-opacity-90">
          {!gameStarted && !gameOver && (
            <div className="p-6 pt-12 pb-6 bg-white bg-opacity-90 rounded-2xl flex flex-col items-center">
              <Brain className="w-20 h-20 text-red-600 animate-bounce mb-4" />
              <p className="text-center text-xl mb-6 font-bold text-red-600">
                Saudara-saudara! Sudah bosan dibohongi? Ayo ikuti terapi revolusioner ini!
              </p>
              <Button
                onClick={mulaiGame}
                variant="outline"
                className="w-full flex items-center justify-center bg-yellow-500 text-white hover:bg-yellow-600 py-6 text-2xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Shuffle className="mr-2 h-8 w-8" /> Mulai Terapi Ajaib!
              </Button>
            </div>
          )}
          {gameStarted && !gameOver && (
            <div>
              <div className="p-6 pt-6 pb-6 bg-white bg-opacity-90 rounded-2xl mb-6 shadow-md">
                <p className="text-center text-xl font-bold text-red-800">
                  {pertanyaanFallacy[currentQuestionIndex].pertanyaan}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => jawabPertanyaan(true)}
                  variant="outline"
                  className="w-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <CheckCircle className="mr-2 h-6 w-6" /> Iya, Kibul Itu!
                </Button>
                <Button
                  onClick={() => jawabPertanyaan(false)}
                  variant="outline"
                  className="w-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <XCircle className="mr-2 h-6 w-6" /> Bukan Kibul
                </Button>
              </div>
              <div className="flex justify-center items-center mt-6">
                <p className="text-red-600 font-bold">
                  Pertanyaan {currentQuestionIndex + 1} dari {pertanyaanFallacy.length}
                </p>
              </div>
            </div>
          )}
          {gameOver && (
            <div className="p-6 pt-6 pb-6 bg-white bg-opacity-90 rounded-2xl flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4 text-center text-red-600">🎭 Terapi Selesai! 🎭</h2>
              <Brain className="w-20 h-20 text-yellow-600 animate-spin mb-4" />
              <p className="text-center text-2xl mb-2 font-bold text-black">
                Level Kekebalan: <span className="text-green-500">{score}</span> / {pertanyaanFallacy.reduce((sum, q) => sum + q.bobot, 0)}
              </p>
              <p className="text-center text-lg mb-6 text-gray-700">
                {getEvaluasi()}
              </p>
              <div className="w-full h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getFallacyChartData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {getFallacyChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-lg mb-6 text-gray-700">
                Grafik pie di atas menunjukkan perbandingan antara jawaban benar dan salah Anda.
                Bagian yang lebih besar menunjukkan jumlah jawaban yang lebih banyak, baik itu benar atau salah.
                Ini membantu Anda melihat seberapa akurat kemampuan Anda dalam mengidentifikasi fallacy.
              </p>
              {!isScoreSubmitted && (
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mb-4 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      <Trophy className="mr-2 h-5 w-5" /> 🏆 Submit Skor 🏆
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <HighScoreSubmission 
                      onSubmit={submitHighScore} 
                      finalScore={score} 
                      onClose={handleSubmitDialogClose}
                    />
                  </DialogContent>
                </Dialog>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="mb-4 w-full flex items-center justify-center bg-purple-500 text-white hover:bg-purple-600 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Trophy className="mr-2 h-5 w-5" /> Lihat Skor Tertinggi
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Daftar Skor Tertinggi</DialogTitle>
                    <DialogDescription>
                      Berikut adalah daftar skor tertinggi dari semua pemain.
                    </DialogDescription>
                  </DialogHeader>
                  <HighScoreList />
                </DialogContent>
              </Dialog>
              <Button
                onClick={mulaiGame}
                variant="outline"
                className="w-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Shuffle className="mr-2 h-6 w-6" /> Terapi Ulang!
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AplikasiTerapiAntiKibul;