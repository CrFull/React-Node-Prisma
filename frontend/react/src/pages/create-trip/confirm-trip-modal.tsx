import { AtSign, Plus, User, X } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";

interface ConfirmTripsModalProps{
    closeConfirmTripModal: () => void,
    createTrip : (event: FormEvent<HTMLFormElement>) => void,
}   

export function ConfirmTripModal(props:ConfirmTripsModalProps){
    return(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-lg font-semibold">Confirmar criação de viagem</h2>
                  <button>
                    <X className="size-5 text-zinc-400 hover:text-zinc-50" onClick={props.closeConfirmTripModal} />
                  </button>
                </div>

                <p className="text-sm text-zinc-400">
                <span>Para concluir a criação da viagem para</span> <span className="text-zinc-100 font-semibold">**viagem**</span> , nas datas de <span className="text-zinc-100 font-semibold">**data**</span>  preencha os dados abaixo:
                </p>
              </div>
              
              
              <form onSubmit={props.createTrip} className="space-y-3">
                <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                  <User className="text-zinc-400 size-5" />
                  <input
                    name="name"
                    placeholder="Seu nome completo"
                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  />
                </div>

                <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                  <AtSign className="text-zinc-400 size-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu e-mail pessoal"
                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  />
                </div>  

                <Button variant="primary" size="full">
                  <span>Confirmar criação da viagem</span>
                  <Plus className="size-5" />
                </Button>

              </form>

            </div>
          </div>
    )
}