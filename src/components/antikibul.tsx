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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const fetchScores = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('https://antikibul-be.seo.pawonmburi.com/scores');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setScores(data || []); // Handle null response by setting an empty array
        } catch (err) {
          setError("Failed to fetch high scores");
          console.error("Error fetching scores:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchScores();
    }, []);

    if (isLoading) return <p>Memuat daftar skor tertinggi...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <>
        {scores?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Belum ada skor tertinggi yang tercatat.</p>
            <p className="text-gray-500">Jadilah yang pertama untuk mengirimkan skor Anda!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Peringkat</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="text-right">Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores?.map((score, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{score.name}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    );
  };

  const handleSubmitDialogClose = (submitted = false) => {
    setIsSubmitDialogOpen(false);
    if (submitted) {
      setIsScoreSubmitted(true);
      setIsSubmitDialogOpen(false);
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
      const response = await fetch('https://antikibul-be.seo.pawonmburi.com/scores', {
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
      setIsSubmitDialogOpen(false);
      return response;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }, [score]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://antikibul-be.seo.pawonmburi.com/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const mulaiGame = async () => {
    const questions = await fetchQuestions();
    console.log(questions);
    if (questions.length > 0) {
      setPertanyaanFallacy(questions);
      setGameStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameOver(false);
      setFallacyResults({});
      setIsScoreSubmitted(false);
      setIsSubmitDialogOpen(false);
    }
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
    if (persentase >= 95) {
      return "Wah! Anda sudah kebal terhadap segala jenis kibul-kibulan! Otak Anda sekuat baja, tidak bisa ditipu daya!";
    } else if (persentase >= 85) {
      return "Hebat! Anda hampir tidak bisa ditipu. Hanya sedikit celah yang tersisa!";
    } else if (persentase >= 75) {
      return "Lumayan juga! Anda sudah bisa menangkis sebagian besar rayuan gombal. Tapi hati-hati, masih ada celah untuk dikelabui!";
    } else if (persentase >= 65) {
      return "Bagus! Anda cukup waspada, tapi masih ada ruang untuk perbaikan.";
    } else if (persentase >= 55) {
      return "Aduh! Anda masih gampang termakan omongan manis. Perlu lebih banyak latihan anti-kibul nih!";
    } else if (persentase >= 45) {
      return "Hati-hati! Anda cukup rentan terhadap kibul-kibulan. Perlu lebih banyak latihan.";
    } else if (persentase >= 35) {
      return "Waduh! Anda masih sangat rentan terhadap kibul-kibulan. Segera ikuti terapi intensif anti-kibul sebelum terlambat!";
    } else {
      return "Oh tidak! Anda sangat mudah tertipu. Perlu terapi intensif anti-kibul!";
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
                <p className="text-center text-lg font-semibold text-blue-700 mt-2">
                  Apakah statemen ini ngibul?
                </p>
              </div>
              <div className="flex flex-col gap-4">
              <Button
                  onClick={() => jawabPertanyaan(false)}
                  variant="outline"
                  className="w-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <CheckCircle className="mr-2 h-6 w-6" /> Nggak Ngibul
                </Button>
                <Button
                  onClick={() => jawabPertanyaan(true)}
                  variant="outline"
                  className="w-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <XCircle className="mr-2 h-6 w-6" /> Ngibul Nih!
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
                      🏆 Submit Skor 🏆
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